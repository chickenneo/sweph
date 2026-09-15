/* Ephemeris files compiled into the addon; see tools/gen_embedded.js. */

#ifndef SWEPH_EMBEDDED_EPHE_H
#define SWEPH_EMBEDDED_EPHE_H

#ifndef _GNU_SOURCE
#define _GNU_SOURCE /* fmemopen */
#endif

#include <stdio.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Returns a read-only FILE* over the embedded copy of fname, or NULL when the
   file is not embedded, in which case the caller falls back to disk. */
FILE *swi_fopen_embedded(const char *fname);

int swi_embedded_count(void);

#ifdef __cplusplus
}
#endif

#endif
