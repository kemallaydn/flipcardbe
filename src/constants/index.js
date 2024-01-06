const IGNORE_REGEX = "([^/]+)"; // confim all cases except / char
const IGNORE = ":IGNORE:";
const l = "/"; // slash (/) char
const s = "^"; // start
const e = "$"; //end

export const PATHS = [
  {
    path: "/authentication/login",
    method: "POST",
  },
  {
    path: "/authentication/signup",
    method: "POST",
  },
  {
    path: "/health-check",
    method: "GET",
  },  {
    path: "/not",
    method: "GET",
  },
  {
    path: "/words",
    method: "GET",
  },{
    path: `/socket.io${IGNORE}`,
    method: "GET",
  },{
    path: `/socket.io${IGNORE}`,
    method: "POST",
  },
];

let a = PATHS.map((p) => {
  return {
    ...p,
    path: new RegExp(
      s + p.path.replaceAll("/", l).replaceAll(":IGNORE:", IGNORE_REGEX) + e
    ),
  };
});

export const WHITELIST = a;

export const LogLevel = {
  Error: "Error",
  Log: "Info",
  Debug: "Debug",
};
