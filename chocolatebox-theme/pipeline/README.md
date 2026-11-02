# Season board pipeline (internal tooling)

Renders the chocolatebox season boards in `../season-boards/`. Not app code.

    P=chocolatebox-theme/pipeline
    (cd $P/r3d && npm i)                       # three.js for 3D renders
    node $P/r3d/render.js <seasons> banner|charm   # -> $P/r3d/out-*.png
    python3 $P/gem/gen.py models               # needs GEMINI_API_KEY
    python3 $P/gem/gen.py gen <model> all banner   # -> $P/gem/out/
    node $P/cap1.js $P default,christmas,... boxes,shop,detail,news,buy   # -> $P/design/phones/
    node $P/capframes.js $P
    mkdir -p $P/design/boards && node $P/boards.js $P   # -> $P/design/boards/*.png

Banner / charm images used by the screens: `design/assets/r3d-banner-<season>.png`, `design/assets/r3d-charm-<season>.png`.
