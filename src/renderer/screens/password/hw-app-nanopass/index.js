// @flow
import type Transport from "@ledgerhq/hw-transport";

export default class NanoPass {
  transport: Transport<*>;

  constructor(transport: Transport<*>, scrambleKey: string = "NanoPass") {
    this.transport = transport;
  }

  /**
   * Strip zeros from buffer and return the stored string.
   */
  bufToString(buffer: Buffer): string {
    let size = buffer.length;
    while (size > 0 && buffer[size - 1] === 0) {
      size -= 1;
    }
    return buffer.slice(0, size).toString();
  }

  /**
   * Creates a buffer from a string and pad with zeros.
   * @param s String
   * @param size Buffer size 
   */
  stringToBuf(s: string, size: number): Buffer {
    let sBytes = Buffer.from(s, "ascii");
    if (sBytes.length > size) throw new Error("string too long for buffer");
    let result = Buffer.alloc(size, 0);
    sBytes.copy(result);
    return result;
  }

  /**
   * Get number of stored passwords on the device
   */
  async getSize(): Promise<number> {
    const response = await this.transport.send(0x80, 0x02, 0, 0);
    return response.readUInt32BE(0);
  }

  /**
   * Get name of nth password.
   */
  async getEntry(index: number) {
    const data = Buffer.alloc(4);
    data.writeUInt32BE(index, 0);
    const response = await this.transport.send(0x80, 0x04, 0, 0, data);
    return {
      name: this.bufToString(response.slice(0, 32)),
      description: this.bufToString(response.slice(32, 32+64))
    };
  }

  /**
   * @return List of password names
   */
  async getEntries(): Promise<Array<string>> {
    const size = await this.getSize();
    const result = [];
    for (let i = 0; i < size; i++) {
      const name = await this.getEntry(i);
      result.push(name);
    }
    console.log("result nano app", result);
    return result;
  }

  /**
   * @param name Password name
   * @return password string
   */
  async getByName(name: string): string {
    const response = await this.transport.send(0x80, 0x05, 0, 0,
      this.stringToBuf(name, 32));
    return this.bufToString(response.slice(0, response.length-2));
  }

  /**
   * @param name Password name
   * @return password string
   */
  async showByName(name: string): string {
    const response = await this.transport.send(0x80, 0x0d, 0, 0,
      this.stringToBuf(name, 32));
  }

  /**
   * Add a new password entry
   * @param name 
   * @param password Password value. If empty, password is generated by the
   *        Nano S.
   */
  async add(name: string, description: string, password: string) {
    let data = this.stringToBuf(name, 32);
    data = Buffer.concat([data, this.stringToBuf(description, 64)]);
    let p1 = 0;
    if (password.length == 0) {
      p1 = 1;
    } else {
      data = Buffer.concat([data, this.stringToBuf(password, 32)]);
    }
    await this.transport.send(0x80, 0x03, p1, 0, data);
  }

  /**
   * Delete a password.
   * @param name Password name
   */
  async deleteByName(name: string): string {
    await this.transport.send(0x80, 0x06, 0, 0, this.stringToBuf(name, 32));
  }
}
