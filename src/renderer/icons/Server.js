// @flow

import React from "react";

const path = (
  <path
    d="M11.2656 10.2812C11.2656 9.95117 10.9863 9.67188 10.6562 9.67188C10.3008 9.67188 10.0469 9.95117 10.0469 10.2812C10.0469 10.6367 10.3008 10.8906 10.6562 10.8906C10.9863 10.8906 11.2656 10.6367 11.2656 10.2812ZM9.03125 9.67188C8.67578 9.67188 8.42188 9.95117 8.42188 10.2812C8.42188 10.6367 8.67578 10.8906 9.03125 10.8906C9.36133 10.8906 9.64062 10.6367 9.64062 10.2812C9.64062 9.95117 9.36133 9.67188 9.03125 9.67188ZM10.6562 6.01562C10.3008 6.01562 10.0469 6.29492 10.0469 6.625C10.0469 6.98047 10.3008 7.23438 10.6562 7.23438C10.9863 7.23438 11.2656 6.98047 11.2656 6.625C11.2656 6.29492 10.9863 6.01562 10.6562 6.01562ZM9.03125 6.01562C8.67578 6.01562 8.42188 6.29492 8.42188 6.625C8.42188 6.98047 8.67578 7.23438 9.03125 7.23438C9.36133 7.23438 9.64062 6.98047 9.64062 6.625C9.64062 6.29492 9.36133 6.01562 9.03125 6.01562ZM13.5 4.1875V1.75C13.5 1.08984 12.9414 0.53125 12.2812 0.53125H1.71875C1.0332 0.53125 0.5 1.08984 0.5 1.75V4.1875V4.21289C0.5 4.39062 0.550781 4.64453 0.652344 4.79688C0.550781 4.97461 0.5 5.22852 0.5 5.40625V7.84375V7.86914C0.5 8.04688 0.550781 8.30078 0.652344 8.45312C0.550781 8.63086 0.5 8.88477 0.5 9.0625V11.5C0.5 12.1855 1.0332 12.7188 1.71875 12.7188H12.2812C12.9414 12.7188 13.5 12.1855 13.5 11.5V9.0625C13.5 8.88477 13.4238 8.63086 13.3223 8.45312C13.4238 8.30078 13.5 8.04688 13.5 7.86914V7.84375V5.40625C13.5 5.22852 13.4238 4.97461 13.3223 4.79688C13.4238 4.64453 13.5 4.39062 13.5 4.21289V4.1875ZM1.71875 4.1875V1.75H12.2812V4.1875H1.71875ZM12.2812 5.40625V7.84375H1.71875V5.40625H12.2812ZM12.2812 9.0625V11.5H1.71875V9.0625H12.2812ZM10.6562 3.57812C10.9863 3.57812 11.2656 3.32422 11.2656 2.96875C11.2656 2.63867 10.9863 2.35938 10.6562 2.35938C10.3008 2.35938 10.0469 2.63867 10.0469 2.96875C10.0469 3.32422 10.3008 3.57812 10.6562 3.57812ZM9.03125 3.57812C9.36133 3.57812 9.64062 3.32422 9.64062 2.96875C9.64062 2.63867 9.36133 2.35938 9.03125 2.35938C8.67578 2.35938 8.42188 2.63867 8.42188 2.96875C8.42188 3.32422 8.67578 3.57812 9.03125 3.57812Z"
    fill="currentColor"
  />
);

const Server = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 14 13" height={size} width={size}>
    {path}
  </svg>
);

export default Server;
