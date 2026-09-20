// Centralized image constants to avoid duplication
// Cloudinary URL format: /upload/{transformations}/{public_id}
// w_ = width, h_ = height, c_ = crop, q_ = quality, f_ = format (f_auto serves AVIF > WebP > JPEG)
export const IMAGES = {
  // Clinic logo — NO transforms: this URL is shared with OG/Twitter meta tags in index.html.
  // Transforms would break social sharing previews. Footer img already has loading="lazy".
  CLINIC_LOGO:
    'https://res.cloudinary.com/mobeet/image/upload/v1789904987/New_v2/xoalnxbo5szhhuhb4qx0_tvebl1.webp',

  /** Footer clinic column only — 72×72 display, 2× retina; OG/meta keep CLINIC_LOGO untransformed */
  CLINIC_LOGO_FOOTER:
    'https://res.cloudinary.com/mobeet/image/upload/w_144,h_144,c_fill,q_auto,f_auto/v1789904987/New_v2/xoalnxbo5szhhuhb4qx0_tvebl1.webp',

  // Doctor hero photo — max-w-md (448px CSS); request 896px for 2× retina sharpness
  DOCTOR_PHOTO:
    'https://res.cloudinary.com/mobeet/image/upload/w_896,c_limit,q_auto,f_auto/v1789916048/New_v2/ptlicwfods7w7iwpbniv_ypmcas.webp',

  /** Same asset as DOCTOR_PHOTO, full Cloudinary delivery (no transforms). Use for JSON-LD / schema.org image URLs. */
  DOCTOR_PHOTO_ORIGINAL:
    'https://res.cloudinary.com/mobeet/image/upload/v1789916048/New_v2/ptlicwfods7w7iwpbniv_ypmcas.webp',

  /** About page portrait — same display envelope as hero (max-w-md ~448px), optimized delivery */
  DOCTOR_PHOTO_ABOUT:
    'https://res.cloudinary.com/mobeet/image/upload/w_448,c_limit,q_auto,f_auto/WEBP/DOCTOR_PHOTO_ABOUT_j3pbtx.webp',

  // Navbar logo — 64×64 display size, request 128×128 (2× retina)
  LOGO_TOP:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,h_128,c_fill,q_auto,f_auto/WEBP/DrAmlanLogoTop_oxkvbz.webp',

  // Service icons — displayed at 64×64 with object-contain (see ServicesSection).
  // Non-square sources (ENT 1280×1145, Vertigo 590×681): use c_limit only — c_fill crops edges.
  VERTIGO_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,c_limit,q_auto,f_auto/WEBP/VERTIGO_ICON_kvxn6z.webp',
  ENT_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_128,c_limit,q_auto,f_auto/WEBP/ENT_ICON_vfq7bw.webp',

  // Google icon — small, login page only
  GOOGLE_ICON:
    'https://res.cloudinary.com/mobeet/image/upload/w_64,h_64,c_fill,q_auto,f_auto/WEBP/GOOGLE_ICON_sygvob.webp',

  /** Identity clarification announcement (full-bleed notice image) */
  IDENTITY_ANNOUNCEMENT:
    'https://res.cloudinary.com/mobeet/image/upload/q_auto,f_auto/v1789904988/New_v2/xyq0i7mesgequ0brgrcw_xkogsr.webp',
} as const;
