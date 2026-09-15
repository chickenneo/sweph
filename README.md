# @chickenneo/sweph

Swiss Ephemeris for Node.js as a single prebuilt native addon for Linux x64,
**with the ephemeris data files compiled into the binary**.

- Nothing to download, no data files to ship, no `set_ephe_path` to configure
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

## Usage

```js
import sweph from "@chickenneo/sweph";
// or: const sweph = require("@chickenneo/sweph");

const { constants: c } = sweph;

const date = sweph.utc_to_jd(2026, 9, 15, 12, 0, 0, c.SE_GREG_CAL);
if (date.flag !== c.OK) throw new Error(date.error);

const [jd_et, jd_ut] = date.data;
const moon = sweph.calc_ut(jd_ut, c.SE_MOON, c.SEFLG_SWIEPH | c.SEFLG_SPEED);

console.log(moon.data[0]); // longitude in degrees
```

Named imports work as well:

```js
import { calc_ut, constants, set_ephe_path } from "@chickenneo/sweph";
```

Swiss Ephemeris keeps global state. Settings such as `set_sid_mode` and `set_topo`
stay in effect for every later call, which matters in a server that handles many requests.

## Ephemeris data

These files are compiled into the addon and are always available:

| File | Covers |
|---|---|
| `sepl_18.se1` | planets, 1800–2399 |
| `semo_18.se1` | the Moon, 1800–2399 |
| `seas_18.se1` | asteroids such as Chiron and Ceres |
| `sefstars.txt` | fixed stars (`fixstar*`) |
| `seorbel.txt` | fictitious bodies |

Calling `set_ephe_path()` is therefore not required. Requests for any of the files above are
served from memory; anything else, such as `sedeltat.txt` or a JPL file, is still read from
the path if one is set. To use different data, for example ephemerides covering years outside
1800–2399, place those files in a folder and pass it to `set_ephe_path()` — note that files
with the names above will still be served from the embedded copies.

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

## Source code and building

The complete source for the published binary is in this repository: the Swiss Ephemeris C
library in `swisseph/`, the N-API bindings in `src/`, the ephemeris data in `ephe/`, and the
build scripts in `tools/`.

Swiss Ephemeris is modified here in exactly one place. In `swisseph/sweph.c`, `swi_fopen()`
first asks `swi_fopen_embedded()` (generated into `src/embedded_ephe.c` by
`tools/gen_embedded.js`) for the requested file and, when it is one of the embedded ones,
returns a read-only `FILE *` over the in-memory copy through `fmemopen()`. Everything else
is unchanged, which is why `glibc` is required.

To rebuild:

```bash
npm install     # node-gyp and node-addon-api
npm run build   # generates sources, compiles, updates ./sweph.node
npm test        # verifies the embedded data is what gets used
```

## Credits

- Swiss Ephemeris — Copyright © 1997–2021 Astrodienst AG, Switzerland. Authors: Dieter Koch and Alois Treindl.
- [sweph](https://github.com/timotejroiko/sweph) — the N-API bindings this package is based on, Copyright © 2021–2026 Timotej Valentin Rojko.
