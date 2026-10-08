// Repeating background tiles as inline SVG data URIs (no image assets needed).

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// Gdańsk across the bay: gabled townhouses, St. Mary's, the Crane gate and shipyard cranes.
export const skylineTile = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="160" viewBox="0 0 1400 160">
  <g fill="#8A79B4">
    <path d="M40 160V104l15-20 15 20v56zM70 160V96l14-22 14 22v64zM98 160V108l12-18 12 18v52zM122 160V92l16-24 16 24v68zM154 160V104l13-18 13 18v56z"/>
    <path d="M196 160V96h64V44h8l4-16 4 16h8v52h44v64z"/>
    <path d="M368 160V76h14V62h24v14h14v84zM378 62l10-15h12l10 15z"/>
    <path d="M440 160V108l14-20 14 20v52zM468 160V98l16-24 16 24v62zM500 160V112l12-16 12 16v48zM524 160V102l14-22 14 22v58z"/>
    <path d="M760 160V34h7v126zM690 36h150v6H690zM826 42h3v42h-3zM820 84h15v6h-15z"/>
    <path d="M990 160V52h6v108zM936 54h118v5H936zM946 59h2v34h-2zM941 93h12v5h-12z"/>
    <path d="M1090 160c40-38 92-38 132 0zM1196 160c52-56 124-56 176 0z"/>
  </g>
</svg>`);

export const shipsTile = svgUrl(`
<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="44" viewBox="0 0 1100 44">
  <g fill="#1F527F">
    <path d="M120 30h120l-12 12H134z"/>
    <path d="M150 18h50v12h-50zM162 8h12v10h-12z"/>
    <path d="M640 34h48l-6 8h-36z"/>
    <path d="M662 6v28h-22z"/>
    <path d="M666 10v24h18z"/>
  </g>
</svg>`);
