#!/usr/bin/env node

/**
 * Generates besom bundle SVG structure with proper cinched appearance
 *
 * TODO: Add handle generation
 * - Include the broom handle with animation
 * - Parameterize handle length, width, color
 * - Handle animation should rotate around its attachment point
 *
 * TODO: Add bucket generation
 * - Generate wooden buckets (not metal)
 * - Use wooden gradient (#d4a574 to #8b6f47) like enchantment SVG
 * - Add vertical plank texture lines
 * - Add wooden rim
 * - Add sloshing water animation
 * - Reference: apprentice-1st-enchantment.svg lines 34-62
 *
 * TODO: Parameterize for scale and position
 * - Add x/y offset parameters so generated output can be directly inserted
 * - Currently assumes local coordinate system (0,0) within a <g transform>
 * - Should support generating complete broom group with transform="translate(x, y)"
 * - Would eliminate manual wrapping step
 *
 * USAGE GUIDE:
 *
 * 1. Generate besom SVG output:
 *    node scripts/generate-besom.js
 *
 * 2. To replace a broom in an existing SVG (e.g., apprentice-autopilot-conducting.svg):
 *    a. Open the target SVG and find the broom group you want to replace
 *       - Look for the broom's <g> with transform="translate(x, y)"
 *       - Note the x and y coordinates (these position the broom)
 *
 *    b. Identify the broom's scale from the existing structure:
 *       - Look at the coordinate values in the existing broom paths
 *       - The handleEndY, cinchY, and bottomY values define the broom size
 *       - For autopilot-conducting.svg brooms: handleEndY ≈ 15, cinchY ≈ 13
 *
 *    c. Generate matching besom with appropriate parameters:
 *       - Use same coordinate values as the existing broom
 *       - Add animBegin delays if needed for staggered animation
 *       - Example: generateBesom({ animBegin: '0.3s' })
 *
 *    d. Replace the old broom structure with generated besom:
 *       - Keep the outer <g transform="translate(x, y)"> wrapper
 *       - Replace everything inside with the generated besom code
 *       - Preserve the bucket <g> if it exists below the broom
 *
 * DIFFICULTY NOTES:
 * - Finding target broom: Easy (search for transform="translate")
 * - Identifying scale/coords: Medium (requires reading existing path coordinates)
 * - Generating replacement: Easy (run this script with params)
 * - Replacing content: Easy (copy/paste, keep wrapper transform)
 *
 * The main challenge is mapping the existing broom's coordinate system to the
 * generate-besom parameters, which requires understanding the Y-axis layout.
 */

function generateBesom(options = {}) {
  const {
    // Y-coordinate where handle ends (top of besom)
    handleEndY = 15,
    // Y-coordinate for top of bristles
    topBristlesY = 3,
    // Y-coordinate for cinch band top
    cinchY = 13,
    // Height of cinch band
    cinchHeight = 6,
    // Y-coordinate where bottom bristles end
    bottomY = 45,
    // Animation duration
    animDuration = '2.5s',
    // Animation begin offset
    animBegin = '',
    // Opacity for secondary bristles
    secondaryOpacity = 0.7
  } = options;

  const cinchBottom = cinchY + cinchHeight;
  const cinchMidY = cinchY + cinchHeight / 2;

  const beginAttr = animBegin ? ` begin="${animBegin}"` : '';

  return `    <!-- Besom bundle (complete structure) -->
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 0 ${cinchMidY}; -3 0 ${cinchMidY}; 0 0 ${cinchMidY}; 3 0 ${cinchMidY}; 0 0 ${cinchMidY}" dur="${animDuration}"${beginAttr} repeatCount="indefinite"/>

      <!-- Top bristles extending above binding band, tapering inward -->
      <path d="M -10,${topBristlesY} L -8,${topBristlesY + 5} L -6.5,${cinchY} L -6,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1.2"/>
      <path d="M -7,${topBristlesY} L -6,${topBristlesY + 5} L -4.5,${cinchY} L -4,${cinchBottom - 1}" fill="#cd9a1b" stroke="#b8860b" stroke-width="1.2"/>
      <path d="M -4,${topBristlesY} L -3.5,${topBristlesY + 5} L -2.5,${cinchY} L -2,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1.2"/>
      <path d="M 4,${topBristlesY} L 3.5,${topBristlesY + 5} L 2.5,${cinchY} L 2,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1.2"/>
      <path d="M 7,${topBristlesY} L 6,${topBristlesY + 5} L 4.5,${cinchY} L 4,${cinchBottom - 1}" fill="#cd9a1b" stroke="#b8860b" stroke-width="1.2"/>
      <path d="M 10,${topBristlesY} L 8,${topBristlesY + 5} L 6.5,${cinchY} L 6,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1.2"/>

      <!-- Secondary bristles for density -->
      <path d="M -8.5,${topBristlesY} L -7,${topBristlesY + 5} L -5.5,${cinchY} L -5,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>
      <path d="M -5.5,${topBristlesY} L -5,${topBristlesY + 5} L -3.5,${cinchY} L -3,${cinchBottom - 1}" fill="#cd9a1b" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>
      <path d="M -1,${topBristlesY} L -1,${topBristlesY + 5} L -0.5,${cinchY} L 0,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>
      <path d="M 1,${topBristlesY} L 1,${topBristlesY + 5} L 0.5,${cinchY} L 0,${cinchBottom - 1}" fill="#cd9a1b" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>
      <path d="M 5.5,${topBristlesY} L 5,${topBristlesY + 5} L 3.5,${cinchY} L 3,${cinchBottom - 1}" fill="#daa520" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>
      <path d="M 8.5,${topBristlesY} L 7,${topBristlesY + 5} L 5.5,${cinchY} L 5,${cinchBottom - 1}" fill="#cd9a1b" stroke="#b8860b" stroke-width="1" opacity="${secondaryOpacity}"/>

      <!-- Brown binding band (cinches the bristles) -->
      <rect x="-7" y="${cinchY}" width="14" height="${cinchHeight}" fill="#654321" rx="1"/>

      <!-- Bottom bristles (forked into walking legs) -->
      <path d="M -7,${cinchBottom} L -10,${cinchBottom + 6} L -13,${cinchBottom + 16} L -11,${cinchBottom + 26}" fill="#daa520" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M -5,${cinchBottom} L -8,${cinchBottom + 6} L -10,${cinchBottom + 16} L -8,${cinchBottom + 26}" fill="#cd9a1b" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M -3,${cinchBottom} L -5,${cinchBottom + 6} L -7,${cinchBottom + 16} L -5,${cinchBottom + 26}" fill="#daa520" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M 3,${cinchBottom} L 5,${cinchBottom + 6} L 7,${cinchBottom + 16} L 5,${cinchBottom + 26}" fill="#daa520" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M 5,${cinchBottom} L 8,${cinchBottom + 6} L 10,${cinchBottom + 16} L 8,${cinchBottom + 26}" fill="#cd9a1b" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M 7,${cinchBottom} L 10,${cinchBottom + 6} L 13,${cinchBottom + 16} L 11,${cinchBottom + 26}" fill="#daa520" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M -1,${cinchBottom} L -2,${cinchBottom + 6} L -3,${cinchBottom + 16} L -2,${cinchBottom + 26}" fill="#cd9a1b" stroke="#b8860b" stroke-width="0.8"/>
      <path d="M 1,${cinchBottom} L 2,${cinchBottom + 6} L 3,${cinchBottom + 16} L 2,${cinchBottom + 26}" fill="#cd9a1b" stroke="#b8860b" stroke-width="0.8"/>
    </g>`;
}

// Generate examples for different use cases
console.log('=== AUTOPILOT BROOM (default) ===');
console.log(generateBesom());

console.log('\n=== AUTOPILOT BROOM 2 (with delay) ===');
console.log(generateBesom({ animBegin: '0.3s' }));

console.log('\n=== FLOOD BROOM (faster animation, smaller) ===');
console.log(generateBesom({
  animDuration: '2s',
  topBristlesY: 3,
  cinchY: 8,
  cinchHeight: 6,
  bottomY: 38
}));

export { generateBesom };
