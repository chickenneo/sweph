# @chickenneo/sweph

Swiss Ephemeris bindings for Node.js, shipped as a prebuilt native addon for Linux x64.

- No install scripts, no build step, no dependencies
- Works with both ESM (`import`) and CommonJS (`require`)
- Full TypeScript types for all 104 functions and 325 constants
- Swiss Ephemeris 2.10.03

## Requirements

| | |
|---|---|
| OS | Linux |
| Architecture | x64 |
| libc | glibc 2.14 or newer |
| Node.js | 20 or newer |

The addon is prebuilt and loaded directly, so no compiler is needed. Other platforms are not supported.

## Installation

```bash
npm install @chickenneo/sweph
pnpm add @chickenneo/sweph
```

## Ephemeris files

The package does not bundle ephemeris data files. Download them from the
[official Swiss Ephemeris repository](https://github.com/aloistr/swisseph/tree/master/ephe)
and point the library at the folder that contains them:

| File | Needed for |
|---|---|
| `sepl_18.se1` | planets, 1800–2399 |
| `semo_18.se1` | the Moon, 1800–2399 |
| `seas_18.se1` | asteroids such as Chiron and Ceres |
| `sefstars.txt` | fixed stars (`fixstar*`) |
| `seorbel.txt` | fictitious bodies |

Without a valid path, Swiss Ephemeris silently falls back to the less accurate
Moshier model instead of reporting an error, so it is worth verifying the path at startup.

## Usage

```js
import sweph from "@chickenneo/sweph";
// or: const sweph = require("@chickenneo/sweph");

const { constants: c } = sweph;

sweph.set_ephe_path("./ephe");

const date = sweph.utc_to_jd(2026, 9, 15, 12, 0, 0, c.SE_GREG_CAL);
if (date.flag !== c.OK) throw new Error(date.error);

const [jd_et, jd_ut] = date.data;
const moon = sweph.calc_ut(jd_ut, c.SE_MOON, c.SEFLG_SWIEPH | c.SEFLG_SPEED);

if (!(moon.flag & c.SEFLG_SWIEPH)) {
  throw new Error("ephemeris files were not found");
}

console.log(moon.data[0]); // longitude in degrees
```

Named imports work as well:

```js
import { calc_ut, constants, set_ephe_path } from "@chickenneo/sweph";
```

Swiss Ephemeris keeps global state. Settings such as `set_ephe_path`, `set_sid_mode`
and `set_topo` stay in effect for every later call, which matters in a server that
handles many requests.

Call `close()` on shutdown to release the ephemeris file handles.

## Documentation

The API mirrors the C library one to one. See the
[official programmer's documentation](https://www.astro.com/swisseph/swephprg.htm)
for what each function does; parameter and return-value descriptions are also
available inline through the bundled TypeScript types.

## License

This package is licensed under **AGPL-3.0-or-later**. See [LICENSE](LICENSE).

Swiss Ephemeris itself is dual licensed by Astrodienst AG under either the AGPL or the
[Swiss Ephemeris Professional License](https://www.astro.com/swisseph/). The choice has to
be made before distributing software that contains it, and before running a public service
built on it. Note that the AGPL applies to network services as well: if this package is used
in a server that users interact with over a network, that server's source code has to be made
available under the AGPL, unless a professional license has been purchased.

## Source code

The bundled `sweph.node` is the unmodified `linux-x64` prebuild from
[sweph v2.10.3-8](https://github.com/timotejroiko/sweph/tree/v2.10.3-8)
([npm](https://www.npmjs.com/package/sweph/v/2.10.3-8)), which is also the corresponding
source for the binary, as required by the AGPL. It is byte-for-byte identical to the one
published there (SHA-1 `d9a3fd472579323fb472f65f18df63e0b02819e3`) and contains the
Swiss Ephemeris C library together with its N-API bindings.

This package differs from `sweph` only in its JavaScript layer: it drops the install
scripts and runtime dependencies, ships a single prebuild for Linux x64, and adjusts the
TypeScript types to the package name.

## Credits

- Swiss Ephemeris — Copyright © 1997–2021 Astrodienst AG, Switzerland. Authors: Dieter Koch and Alois Treindl.
- [sweph](https://github.com/timotejroiko/sweph) — the N-API bindings this package is based on, Copyright © 2021–2026 Timotej Valentin Rojko.
