// Centralized image constants to avoid duplication
// Cloudinary URL format: /upload/{transformations}/{public_id}
// w_ = width, h_ = height, c_ = crop, q_ = quality, f_ = format (f_auto serves AVIF > WebP > JPEG)
export const IMAGES = {
  // Clinic logo — NO transforms: this URL is shared with OG/Twitter meta tags in index.html.
  // Transforms would break social sharing previews. Footer img already has loading="lazy".
  CLINIC_LOGO:
    'https://res.cloudinary.com/mobeet/image/upload/WEBP/DrAmlanLogo_2_spt68s.webp',

  /** Footer clinic column only — 72×72 display, 2× retina; OG/meta keep CLINIC_LOGO untransformed */
  CLINIC_LOGO_FOOTER:
    'https://res.cloudinary.com/mobeet/image/upload/w_144,h_144,c_fill,q_auto,f_auto/WEBP/DrAmlanLogo_2_spt68s.webp',

  // Doctor hero photo — max-w-md (448px) display width, c_limit prevents upscaling
  DOCTOR_PHOTO:
    'https://res.cloudinary.com/mobeet/image/upload/w_448,c_limit,q_auto,f_auto/WEBP/DOCTOR_PHOTO_zgnaz1.webp',

  /** Same asset as DOCTOR_PHOTO, full Cloudinary delivery (no transforms). Use for JSON-LD / schema.org image URLs. */
  DOCTOR_PHOTO_ORIGINAL:
    'https://res.cloudinary.com/mobeet/image/upload/WEBP/DOCTOR_PHOTO_zgnaz1.webp',

  /** About page portrait — same display envelope as hero (max-w-md ~448px), optimized delivery */
  DOCTOR_PHOTO_ABOUT:
    'https://res.cloudinary.com/mobeet/image/upload/w_448,c_limit,q_auto,f_auto/WEBP/DOCTOR_PHOTO_ABOUT_j3pbtx.webp',

  // Navbar logo — 64×64 display size, request 128×128 (2× retina)
  LOGO_TOP:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/DrAmlanLogoTop_oxkvbz.webp',

  // Service icons — displayed at 64×64 with object-contain (see ServicesSection).
  // Non-square sources (ENT 1280×1145, Vertigo 590×681): use c_limit only — c_fill crops edges.
  // Sleep apnea is 1280×1280: c_fill is safe for the 80×80 object-cover slot.
  VERTIGO_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,c_limit,q_auto,f_auto/WEBP/VERTIGO_ICON_kvxn6z.webp',
  ENT_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,c_limit,q_auto,f_auto/WEBP/ENT_ICON_vfq7bw.webp',
  SLEEP_APNEA_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/sleep-apnea-icon_binaek.webp',

  // Google icon — small, login page only
  GOOGLE_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_64,h_64,c_fill,q_auto,f_auto/WEBP/GOOGLE_ICON_sygvob.webp',
} as const;
