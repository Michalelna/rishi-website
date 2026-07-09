import { motion } from 'framer-motion'

interface SymbolProps {
  size?: number
  color?: string
  isHovered?: boolean
}

const HOVER_SPIN = (duration: number, dir = 1) => ({
  animate: (hovered: boolean) =>
    hovered ? { rotate: dir * 360 } : { rotate: 0 },
  transition: (hovered: boolean) =>
    hovered
      ? { duration, repeat: Infinity, ease: 'linear' as const }
      : { duration: 0.6, ease: 'easeOut' as const },
})

const PULSE = {
  animate: (hovered: boolean) =>
    hovered ? { scale: [1, 1.08, 1] } : { scale: 1 },
  transition: (hovered: boolean) =>
    hovered
      ? { duration: 3, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 0.4 },
}

/* transformBox + transformOrigin let framer-motion rotate SVG <g>
   elements around their own geometric centre — no clipping artefacts */
const gStyle = {
  transformBox: 'fill-box' as const,
  transformOrigin: 'center' as const,
}

export function TriangleSymbol({ size = 260, color = 'rgba(245,240,232,0.55)', isHovered = false }: SymbolProps) {
  const s = size
  const cx = s / 2
  // All vertices stay well inside the viewBox so nothing clips during rotation
  const r0 = s * 0.40   // outer triangle inscribed-circle radius
  const r1 = s * 0.27
  const r2 = s * 0.16

  // Equilateral triangle centred at (cx, cx), pointing up
  const tri = (r: number, offset = 0) => {
    const angles = [270, 30, 150].map(a => (a + offset) * Math.PI / 180)
    return angles.map(a => `${cx + r * Math.cos(a)},${cx + r * Math.sin(a)}`).join(' ')
  }

  const spin0 = HOVER_SPIN(40)
  const spin1 = HOVER_SPIN(60, -1)

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} overflow="visible">
      <motion.g
        style={gStyle}
        animate={spin0.animate(isHovered)}
        transition={spin0.transition(isHovered)}
      >
        <polygon points={tri(r0)} fill="none" stroke={color} strokeWidth="1" />
      </motion.g>

      <motion.g
        style={gStyle}
        animate={spin1.animate(isHovered)}
        transition={spin1.transition(isHovered)}
      >
        <polygon points={tri(r1)} fill="none" stroke={color} strokeWidth="0.7" strokeDasharray="4 6" />
      </motion.g>

      <motion.g
        style={gStyle}
        animate={PULSE.animate(isHovered)}
        transition={PULSE.transition(isHovered)}
      >
        <polygon points={tri(r2)} fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="2 5" />
        <circle cx={cx} cy={cx} r={2} fill={color} />
      </motion.g>
    </svg>
  )
}

export function ConcentricCircles({ size = 280, color = 'rgba(245,240,232,0.5)', isHovered = false }: SymbolProps) {
  const s = size
  const cx = s / 2
  const radii = [s * 0.40, s * 0.31, s * 0.22, s * 0.14, s * 0.07]

  const spin0 = HOVER_SPIN(50)
  const spin1 = HOVER_SPIN(35, -1)

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} overflow="visible">
      <motion.g
        style={gStyle}
        animate={spin0.animate(isHovered)}
        transition={spin0.transition(isHovered)}
      >
        {radii.slice(0, 3).map((r, i) => (
          <circle
            key={i} cx={cx} cy={cx} r={r}
            fill="none" stroke={color}
            strokeWidth={i === 0 ? 1.2 : 0.7}
            strokeDasharray={i === 1 ? '5 7' : undefined}
          />
        ))}
        {[0, 90].map((angle, i) => (
          <line
            key={i}
            x1={cx + Math.cos(angle * Math.PI / 180) * radii[0]}
            y1={cx + Math.sin(angle * Math.PI / 180) * radii[0]}
            x2={cx - Math.cos(angle * Math.PI / 180) * radii[0]}
            y2={cx - Math.sin(angle * Math.PI / 180) * radii[0]}
            stroke={color} strokeWidth="0.4"
          />
        ))}
      </motion.g>

      <motion.g
        style={gStyle}
        animate={spin1.animate(isHovered)}
        transition={spin1.transition(isHovered)}
      >
        {radii.slice(3).map((r, i) => (
          <circle key={i} cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth="0.7" />
        ))}
        <circle cx={cx} cy={cx} r={2} fill={color} />
      </motion.g>
    </svg>
  )
}

export function PracticeSymbol({ size = 280, color = 'rgba(245,240,232,0.5)', isHovered = false }: SymbolProps) {
  const dim = HOVER_SPIN(80)
  const pulse = PULSE

  return (
    <svg
      width={size}
      height={Math.round(size * 331 / 356)}
      viewBox="0 0 356 331"
      fill="none"
      overflow="visible"
    >
      <motion.g
        style={gStyle}
        animate={dim.animate(isHovered)}
        transition={dim.transition(isHovered)}
      >
        {/* Outer dashed circle */}
        <circle cx="177.276" cy="176.449" r="141.035" stroke={color} strokeWidth="2" strokeDasharray="3.06 30.6" opacity="0.4" />
        {/* Large outer arc (bottom half solid) */}
        <path d="M329.054 176.449C329.054 216.703 313.063 255.309 284.599 283.773C256.135 312.237 217.53 328.228 177.276 328.228C137.021 328.228 98.416 312.237 69.952 283.773C41.488 255.309 25.4971 216.703 25.4971 176.449" stroke={color} strokeWidth="2" opacity="0.5" />
        {/* Outermost arc (top half) */}
        <path d="M2.35624 176.449C2.35625 130.058 20.7852 85.5663 53.589 52.7625C86.3927 19.9588 130.884 1.52983 177.276 1.52983C223.667 1.52983 268.159 19.9588 300.962 52.7625C333.766 85.5663 352.195 130.058 352.195 176.449" stroke={color} strokeWidth="2" opacity="0.7" />
      </motion.g>

      <motion.g
        style={gStyle}
        animate={HOVER_SPIN(55, -1).animate(isHovered)}
        transition={HOVER_SPIN(55, -1).transition(isHovered)}
      >
        {/* Inner arc bottom */}
        <path d="M288.558 176.036C288.558 190.704 285.669 205.228 280.055 218.78C274.442 232.331 266.215 244.645 255.843 255.017C245.471 265.388 233.158 273.616 219.606 279.229C206.055 284.842 191.531 287.731 176.862 287.731C162.194 287.731 147.67 284.842 134.119 279.229C120.567 273.616 108.254 265.388 97.882 255.017C87.5102 244.645 79.2828 232.331 73.6696 218.78C68.0564 205.228 65.1673 190.704 65.1673 176.036" stroke={color} strokeWidth="2" opacity="0.6" />
        {/* Half-circle right */}
        <path d="M177.276 53.7198C209.826 53.7198 241.042 66.6502 264.058 89.6664C287.075 112.683 300.005 143.899 300.005 176.449C300.005 208.999 287.075 240.216 264.058 263.232C241.042 286.248 209.826 299.178 177.276 299.178" stroke={color} strokeWidth="5" opacity="0.4" />
      </motion.g>

      {/* Dashed arc — counter-rotating */}
      <motion.g
        style={gStyle}
        animate={HOVER_SPIN(65, -1).animate(isHovered)}
        transition={HOVER_SPIN(65, -1).transition(isHovered)}
      >
        <path d="M113.791 285.394C84.9378 268.735 63.8837 241.297 55.2606 209.115C46.6376 176.934 51.1518 142.644 67.8103 113.791C84.4688 84.9377 111.907 63.8837 144.089 55.2606C176.271 46.6375 210.56 51.1518 239.413 67.8103" stroke={color} strokeWidth="1.5" strokeDasharray="3.06 14.05" opacity="0.6" />
      </motion.g>

      {/* Inner circle — pulse */}
      <motion.g
        style={gStyle}
        animate={pulse.animate(isHovered)}
        transition={pulse.transition(isHovered)}
      >
        <circle cx="177.276" cy="170.664" r="61.2097" stroke={color} strokeWidth="0.8" opacity="0.7" />
        <circle cx="177.276" cy="170.664" r="3" fill={color} />
      </motion.g>
    </svg>
  )
}

export function DiamondSymbol({ size = 260, color = 'rgba(245,240,232,0.55)', isHovered = false }: SymbolProps) {
  const s = size
  const cx = s / 2

  // All layers use the same centre so fill-box transform origin is stable
  const r0 = s * 0.40   // outer diamond  (vertices at N/E/S/W)
  const r1 = s * 0.40   // same size, rotated 45° → becomes a square
  const r2 = s * 0.28   // mid diamond
  const r3 = s * 0.18   // inner square (rotated 45°)
  const r4 = s * 0.10   // innermost diamond

  const diamond = (r: number) =>
    `${cx},${cx - r} ${cx + r},${cx} ${cx},${cx + r} ${cx - r},${cx}`

  const spin0 = HOVER_SPIN(45)
  const spin1 = HOVER_SPIN(30, -1)

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} overflow="visible">
      {/* Outer layer — large diamond + dashed square (same r, 45°) */}
      <motion.g
        style={gStyle}
        animate={spin0.animate(isHovered)}
        transition={spin0.transition(isHovered)}
      >
        <polygon points={diamond(r0)} fill="none" stroke={color} strokeWidth="1" />
        <polygon
          points={diamond(r1)}
          fill="none" stroke={color} strokeWidth="0.55"
          strokeDasharray="3 6"
          transform={`rotate(45 ${cx} ${cx})`}
        />
      </motion.g>

      {/* Mid layer — counter-rotating diamond */}
      <motion.g
        style={gStyle}
        animate={spin1.animate(isHovered)}
        transition={spin1.transition(isHovered)}
      >
        <polygon points={diamond(r2)} fill="none" stroke={color} strokeWidth="0.8" />
        <polygon
          points={diamond(r3)}
          fill="none" stroke={color} strokeWidth="0.5"
          strokeDasharray="2 5"
          transform={`rotate(45 ${cx} ${cx})`}
        />
      </motion.g>

      {/* Inner — pulse */}
      <motion.g
        style={gStyle}
        animate={PULSE.animate(isHovered)}
        transition={PULSE.transition(isHovered)}
      >
        <polygon points={diamond(r4)} fill="none" stroke={color} strokeWidth="1.2" />
        <circle cx={cx} cy={cx} r={2.5} fill={color} />
      </motion.g>
    </svg>
  )
}

export function LearningSymbol({ size = 335, color = 'rgba(245,240,232,0.55)' }: Omit<SymbolProps, 'isHovered'>) {
  const scale = size / 335
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 335 335"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
    >
      {/* Outer long diagonal lines */}
      <line x1="0.464884" y1="-0.464884" x2="225.696" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 167.056 326.795)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="225.696" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 7.13599 166.875)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="225.696" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 167.056 6.95483)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="225.696" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 7.13599 165.945)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      {/* Mid diagonal lines */}
      <line x1="0.464884" y1="-0.464884" x2="159.075" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 167.056 279.651)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="117.875" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 226.148 301.381)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="159.075" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 54.2441 166.839)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="117.875" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 22.8387 110.469)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="159.075" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 167.056 54.0271)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="117.875" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 226.148 26.7898)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      {/* Straight diagonal lines */}
      <line x1="54.9016" y1="166.184" x2="167.614" y2="279.272" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="24.3226" y1="217.703" x2="107.759" y2="301.417" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      {/* Dashed horizontal/vertical lines */}
      <line opacity="0.8" x1="86.4762" y1="245.388" x2="246.809" y2="245.388" stroke={color} strokeWidth="2.47938" strokeDasharray="3.06 14.05"/>
      <line opacity="0.8" y1="-1.23969" x2="159.507" y2="-1.23969" transform="matrix(1 1.09278e-07 1.09278e-07 -1 87.3026 87.1213)" stroke={color} strokeWidth="2.47938" strokeDasharray="3.06 14.05"/>
      <line opacity="0.8" y1="-1.23969" x2="159.507" y2="-1.23969" transform="matrix(-1.09278e-07 1 1 1.09278e-07 246.809 87.1213)" stroke={color} strokeWidth="2.47938" strokeDasharray="3.06 14.05"/>
      <line opacity="0.8" y1="-1.23969" x2="159.507" y2="-1.23969" transform="matrix(-1.09278e-07 1 1 1.09278e-07 88.129 86.2949)" stroke={color} strokeWidth="2.47938" strokeDasharray="3.06 14.05"/>
      {/* Inner short lines */}
      <line x1="166.496" y1="222.448" x2="221.551" y2="166.842" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="77.5324" y2="-0.464884" transform="matrix(0.707107 -0.707107 -0.707107 -0.707107 111.904 166.839)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="77.5324" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 167.056 111.687)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      <line x1="0.464884" y1="-0.464884" x2="77.5324" y2="-0.464884" transform="matrix(0.707107 0.707107 0.707107 -0.707107 111.904 166.518)" stroke={color} strokeWidth="0.929768" strokeLinecap="round"/>
      {/* Large rotated dashed rect */}
      <rect opacity="0.5" y="-3.50637" width="231.151" height="231.315" transform="matrix(-0.707107 0.707107 0.707107 0.707107 169.434 5.9857)" stroke={color} strokeWidth="4.95876" strokeMiterlimit="16" strokeLinecap="round" strokeDasharray="11.57 11.57"/>
      {/* Center square */}
      <rect x="136.477" y="135.469" width="61.158" height="61.158" stroke={color} strokeWidth="4.1323"/>
    </svg>
  )
}
