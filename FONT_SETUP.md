# Font Setup Instructions

## Required Fonts

This project uses two custom fonts:

1. **Unbounded** - For main headings (H1, H2, H3)
2. **Satoshi** - For small headings and body text

## Setup Steps

1. **Download the fonts:**
   - **Unbounded**: Download from [GitHub Repository](https://github.com/w3f/unbounded)
   - **Satoshi**: Download from [Dafont Free](https://www.dafontfree.io/satoshi-font/) or [UpFonts](https://upfonts.com/satoshi-font/)

2. **Create the fonts directory:**
   ```
   app/fonts/
   ```

3. **Place the font files in `app/fonts/` with these exact names:**
   
   **Unbounded:**
   - `Unbounded-Light.woff2`
   - `Unbounded-Regular.woff2`
   - `Unbounded-Medium.woff2`
   - `Unbounded-Bold.woff2`
   
   **Satoshi:**
   - `Satoshi-Light.woff2`
   - `Satoshi-Regular.woff2`
   - `Satoshi-Medium.woff2`
   - `Satoshi-Bold.woff2`

4. **Convert fonts to WOFF2 format if needed:**
   - You can use online converters like [CloudConvert](https://cloudconvert.com/) or [FontSquirrel Webfont Generator](https://www.fontsquirrel.com/tools/webfont-generator)

## Alternative: Using Google Fonts (if available)

If Unbounded becomes available on Google Fonts in the future, you can update `app/layout.tsx` to use:
```typescript
import { Unbounded } from "next/font/google";
```

## Current Font Configuration

- **H1, H2, H3**: Unbounded font family
- **H4, H5, H6, body text, buttons, etc.**: Satoshi font family

The fonts are configured in:
- `app/layout.tsx` - Font imports and variables
- `app/globals.css` - Font family assignments

