# Full-viewport hero refinement

## Changes
- Measure the visible navigation bar with a resize observer so the layout uses its actual rendered height on every device.
- Make the opening section exactly one modern viewport tall, with its usable content area calculated as `viewport height − header height` while preserving the existing fixed, transparent navigation overlay.
- Keep the current hero image, copy, buttons, overlay, animation, and styling unchanged; only make minimal vertical-spacing adjustments if required to prevent clipping on short screens.
- Change only the specified night-exterior crop from `sm:object-[center_58%]` to `sm:object-[center_22%]`.

## Technical details
- Use `svh` as the safe fallback and `dvh` where supported for mobile browser chrome behavior.
- Store the measured header height in a scoped CSS custom property with a sensible fallback, then use it in the hero's height calculation.
- Keep every section after the hero in its existing order and unchanged.

## Verification
- Check 1920×1080, 1440×900, 1366×768, 1280×800, 1024×768, 768×1024, 430×932, 390×844, and 375×812.
- At each size, confirm the header is visible, the Story section starts at or below the viewport boundary, hero content remains visible, the crop is composed correctly, and there is no horizontal overflow.
- Verify scrolling reveals Story naturally, local images load, interactions remain intact, the type check succeeds, and browser console errors are absent.
