// @flow

import React from "react";

const Atom = ({ size }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size}>
      <path
        fill="currentColor"
        d="M13.4062 8C15.0938 5.40625 15.5 2.96875 14.25 1.75C13.0312 0.5 10.5938 0.90625 8 2.59375C5.375 0.90625 2.9375 0.5 1.71875 1.75C0.46875 2.96875 0.875 5.40625 2.5625 8C0.875 10.625 0.46875 13.0625 1.71875 14.2812C3.625 16.1875 7.40625 13.8125 8 13.4375C8.5625 13.8125 12.3438 16.1875 14.25 14.2812C15.5 13.0625 15.0938 10.625 13.4062 8ZM3.5 6.6875C2.4375 4.8125 2.25 3.3125 2.75 2.78125C3.46875 2.09375 5.34375 2.78125 6.65625 3.53125C5.6875 4.3125 4.28125 5.71875 3.5 6.6875ZM6.65625 12.4688C4.78125 13.5625 3.28125 13.75 2.75 13.2188C2.25 12.6875 2.4375 11.2188 3.5 9.34375C4.28125 10.3125 5.6875 11.7188 6.65625 12.4688ZM11.5625 8C10.5312 9.4375 9.40625 10.5625 7.96875 11.5938C6.5625 10.5625 5.46875 9.4375 4.40625 8C5.25 6.875 6.84375 5.25 7.96875 4.40625C9.125 5.25 10.7188 6.875 11.5625 8ZM9 8C9 7.46875 8.53125 7 8 7H7.96875C7.4375 7 6.96875 7.46875 6.96875 8C6.96875 8.5625 7.4375 9 7.96875 9C8.53125 9 9 8.5625 9 8ZM12.4688 9.34375C13.5312 11.2188 13.7188 12.6875 13.2188 13.2188C12.6875 13.75 11.1875 13.5625 9.3125 12.4688C10.2812 11.7188 11.6875 10.3125 12.4688 9.34375ZM9.3125 3.53125C10.625 2.78125 12.5 2.09375 13.2188 2.78125C13.7188 3.3125 13.5312 4.8125 12.4688 6.6875C11.6875 5.71875 10.2812 4.3125 9.3125 3.53125Z"
      />
  </svg>
);

export default Atom;