import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/Editor.css";
import Toast from "../components/Toast";

const GRID_SIZE = 20;

const TOOL_CONFIG = {
  Wall: {
    icon: "▧",
    variants: [
      { key: "StoneWall", label: "Stone Wall", colorClass: "variant-stone" },
      { key: "WoodWall", label: "Wood Wall", colorClass: "variant-wood" },
      { key: "MetalWall", label: "Metal Wall", colorClass: "variant-metal" },
    ],
    description: "Creates a blocking structure in the level.",
  },
  Collectible: {
    icon: "◉",
    variants: [
      { key: "Coin", label: "Coin", colorClass: "variant-coin" },
      { key: "Shield", label: "Shield", colorClass: "variant-shield" },
      { key: "Gem", label: "Gem", colorClass: "variant-gem" },
    ],
    description: "Places a collectible reward object on the map.",
  },
  Enemy: {
    icon: "✦",
    variants: [
      { key: "Slime", label: "Slime", colorClass: "variant-slime" },
      { key: "Skeleton", label: "Skeleton", colorClass: "variant-skeleton" },
      { key: "Guard", label: "Guard", colorClass: "variant-guard" },
    ],
    description: "Adds an enemy entity to the level.",
  },
  PlayerStart: {
    icon: "▶",
    variants: [
      { key: "PlayerStart", label: "Player Start", colorClass: "variant-start" },
    ],
    description: "Defines the player spawn point.",
  },
  Exit: {
    icon: "⬒",
    variants: [
      { key: "Door", label: "Door", colorClass: "variant-door" },
      { key: "Portal", label: "Portal", colorClass: "variant-portal" },
      { key: "Gate", label: "Gate", colorClass: "variant-gate" },
    ],
    description: "Marks the level objective or end point.",
  },
  Eraser: {
    icon: "⌫",
    variants: [
      { key: "Eraser", label: "Eraser", colorClass: "variant-eraser" },
    ],
    description: "Removes an object from the selected cell.",
  },
};

const TOOL_ORDER = ["Wall", "Collectible", "Enemy", "PlayerStart", "Exit", "Eraser"];

function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedTool, setSelectedTool] = useState("Wall");
  const [selectedVariant, setSelectedVariant] = useState("StoneWall");
  const [levelName, setLevelName] = useState("Untitled Level");
  const [cells, setCells] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [saveStatus, setSaveStatus] = useState("Unsaved");
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const selectedToolConfig = TOOL_CONFIG[selectedTool];
  const selectedVariantConfig = selectedToolConfig.variants.find(
    (variant) => variant.key === selectedVariant
  );

  const generateEmptyGrid = useCallback(() => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        grid.push({ x, y, object: null });
      }
    }
    return grid;
  }, []);

  const getSerializedCells = useCallback(() => {
    return cells
      .filter((cell) => cell.object !== null)
      .map((cell) => ({
        x: cell.x,
        y: cell.y,
        object: {
          type: cell.object.type,
          variant: cell.object.variant,
        },
      }));
  }, [cells]);

  const fetchLevel = useCallback(async () => {
    try {
      const res = await API.get(`/levels/${id}`);
      setLevelName(res.data.name || "Untitled Level");

      const emptyGrid = generateEmptyGrid();

      if (res.data.cells && res.data.cells.length > 0) {
        const updatedGrid = emptyGrid.map((cell) => {
          const existingCell = res.data.cells.find(
            (c) => c.x === cell.x && c.y === cell.y
          );

          return existingCell
            ? {
                ...cell,
                object: existingCell.object
                  ? {
                      type: existingCell.object.type,
                      variant: existingCell.object.variant || existingCell.object.type,
                    }
                  : null,
              }
            : cell;
        });

        setCells(updatedGrid);
      } else {
        setCells(emptyGrid);
      }

      setSaveStatus("Saved");
    } catch (error) {
      showToast("Failed to load level.", "error");
    }
  }, [generateEmptyGrid, id]);

  const applyToolToCell = (x, y) => {
    setCells((prevCells) =>
      prevCells.map((cell) => {
        if (cell.x === x && cell.y === y) {
          if (selectedTool === "Eraser") {
            return { ...cell, object: null };
          }

          return {
            ...cell,
            object: {
              type: selectedTool,
              variant: selectedVariant,
            },
          };
        }
        return cell;
      })
    );

    setSaveStatus("Unsaved");
  };

  const handleMouseDown = (x, y) => {
    setIsDrawing(true);
    applyToolToCell(x, y);
  };

  const handleMouseEnter = (x, y) => {
    if (isDrawing) {
      applyToolToCell(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleSaveLevel = async () => {
    try {
      const serializedCells = getSerializedCells();

      await API.put(`/levels/${id}`, {
        name: levelName,
        gridSize: GRID_SIZE,
        cells: serializedCells,
      });

      setSaveStatus("Saved");
      showToast("Level saved successfully.", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to save level.", "error");
    }
  };

  const handleClearGrid = () => {
    setCells(generateEmptyGrid());
    setSaveStatus("Unsaved");
    showToast("Grid cleared.", "info");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handlePlayLevel = async () => {
    try {
      await API.get(`/levels/${id}/export`);
      showToast("Level exported successfully for Unreal Engine integration.", "success");
    } catch (error) {
      showToast("Failed to export level.", "error");
    }
  };

  const handleAnalyzeLevel = () => {
    showToast("AI Analyze feature placeholder is ready.", "info");
  };

  const handleSuggestLevel = () => {
    showToast("AI Suggest feature placeholder is ready.", "info");
  };

  const handleLevelNameChange = (e) => {
    setLevelName(e.target.value);
    setSaveStatus("Unsaved");
  };

  const handleReloadLevel = () => {
    fetchLevel();
    showToast("Last saved version reloaded.", "info");
  };

  const getCellVisualClass = (cell) => {
    if (!cell.object) return "cell-void";

    const variant = cell.object.variant || cell.object.type;

    const variantMap = {
      StoneWall: "cell-stone-wall",
      WoodWall: "cell-wood-wall",
      MetalWall: "cell-metal-wall",
      Coin: "cell-coin",
      Shield: "cell-shield",
      Gem: "cell-gem",
      Slime: "cell-slime",
      Skeleton: "cell-skeleton",
      Guard: "cell-guard",
      PlayerStart: "cell-player-start",
      Door: "cell-door",
      Portal: "cell-portal",
      Gate: "cell-gate",
    };

    return variantMap[variant] || "cell-void";
  };

  const getCellSymbol = (cell) => {
    if (!cell.object) return "";

    const variant = cell.object.variant || cell.object.type;

    const symbolMap = {
      StoneWall: "◼",
      WoodWall: "▥",
      MetalWall: "▣",
      Coin: "●",
      Shield: "⬟",
      Gem: "◆",
      Slime: "✦",
      Skeleton: "☠",
      Guard: "✸",
      PlayerStart: "▶",
      Door: "▤",
      Portal: "◎",
      Gate: "▦",
    };

    return symbolMap[variant] || "";
  };

  const occupiedCount = useMemo(() => getSerializedCells().length, [getSerializedCells]);

  useEffect(() => {
    fetchLevel();
  }, [fetchLevel]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const firstVariant = TOOL_CONFIG[selectedTool].variants[0].key;
    setSelectedVariant(firstVariant);
  }, [selectedTool]);

  return (
    <div className="editor-page">
      <Toast toast={toast} />

      <aside className="editor-sidebar">
        <div className="editor-sidebar-top">
          <button className="editor-sidebar-brand editor-brand-btn" onClick={() => navigate("/")}>
            <div className="forge-logo-box">▣</div>
            <div>
              <h2>LevelForge</h2>
              <p>Realm Editor</p>
            </div>
          </button>

          <div className="editor-tools-panel pixel-card">
            <div className="panel-title-row">
              <span className="panel-kicker">TOOLS</span>
            </div>

            <div className="tool-grid">
              {TOOL_ORDER.map((tool) => (
                <button
                  key={tool}
                  className={`tool-card pixel-card-sm ${selectedTool === tool ? "tool-card-active" : ""}`}
                  onClick={() => setSelectedTool(tool)}
                  title={TOOL_CONFIG[tool].description}
                >
                  <span className="tool-icon">{TOOL_CONFIG[tool].icon}</span>
                  <span className="tool-name">{tool}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-forge btn-dark editor-back-btn" onClick={handleBackToDashboard}>
          ← Dashboard
        </button>
      </aside>

      <div className="editor-main">
        <header className="editor-topbar">
          <div className="editor-level-meta">
            <input
              className="level-name-input"
              value={levelName}
              onChange={handleLevelNameChange}
              title="Rename level"
            />

            <span
              className={`editor-status-badge ${
                saveStatus === "Saved" ? "status-saved" : "status-unsaved"
              }`}
              title="Current save state"
            >
              {saveStatus}
            </span>
          </div>

          <div className="editor-actions">
            <button className="btn-forge btn-dark" onClick={handleReloadLevel} title="Reload the last saved version">
              Reload
            </button>
            <button className="btn-forge btn-yellow" onClick={handleClearGrid} title="Clear the entire grid">
              Clear
            </button>
            <button className="btn-forge btn-green" onClick={handleSaveLevel} title="Save current level">
              Save
            </button>
            <button className="btn-forge btn-cyan" onClick={handlePlayLevel} title="Export and test current level">
              Play/Test
            </button>
          </div>
        </header>

        <main className="editor-workspace">
          <div className="editor-grid-panel pixel-card">
            <div className="editor-grid-header">
              <div className="editor-grid-title-block">
                <h3>Realm Canvas</h3>
                <p>20×20 interactive grid for object placement</p>
              </div>
            </div>

            <div className="editor-grid-stage">

              <div className="editor-grid-center">
                <div className="editor-grid-wrapper">
                  <div className="editor-grid">
                    {cells.map((cell, index) => (
                      <div
                        key={index}
                        className={`grid-cell ${getCellVisualClass(cell)}`}
                        onMouseDown={() => handleMouseDown(cell.x, cell.y)}
                        onMouseEnter={() => handleMouseEnter(cell.x, cell.y)}
                        title={cell.object ? `${cell.object.variant || cell.object.type}` : "Void cell"}
                      >
                        {getCellSymbol(cell)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="editor-legend-vertical">
                  <span>Void = empty</span>
                  <span>Walls = blockers</span>
                  <span>Items = rewards</span>
                  <span>Enemies = threats</span>
                  <span>Exit = goal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="editor-side-panels">
            <div className="editor-preview-panel pixel-card">
              <div className="panel-kicker">SELECTED TOOL</div>
              <div className="selected-tool-preview">
                <div className={`selected-tool-icon ${selectedVariantConfig?.colorClass || ""}`}>
                  {TOOL_CONFIG[selectedTool].icon}
                </div>
                <div>
                  <h4>{selectedVariantConfig?.label || selectedTool}</h4>
                  <p>{selectedToolConfig.description}</p>
                </div>
              </div>
            </div>

            <div className="editor-variants-panel pixel-card">
              <div className="panel-kicker">VARIANTS</div>
              <div className="variant-grid-right">
                {selectedToolConfig.variants.map((variant) => (
                  <button
                    key={variant.key}
                    className={`variant-card pixel-card-sm ${
                      selectedVariant === variant.key ? "variant-card-active" : ""
                    } ${variant.colorClass}`}
                    onClick={() => setSelectedVariant(variant.key)}
                    title={variant.label}
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-ai-panel pixel-card">
              <div className="panel-kicker">AI ASSISTANT</div>
              <p>Analyze your current layout or request design suggestions for better gameplay flow.</p>
              <div className="ai-button-group">
                <button className="btn-forge btn-green" onClick={handleAnalyzeLevel} title="Analyze current level layout">
                  Analyze
                </button>
                <button className="btn-forge btn-cyan" onClick={handleSuggestLevel} title="Get improvement suggestions">
                  Suggest
                </button>
              </div>
            </div>

            <div className="editor-json-panel pixel-card">
              <div className="panel-kicker">EXPORT READY</div>
              <p>
                Your realm is serialized into structured JSON and prepared for Unreal Engine integration.
              </p>
              <div className="json-mini-box pixel-card-sm">
                <span>{occupiedCount}</span>
                <small>occupied cells</small>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Editor;