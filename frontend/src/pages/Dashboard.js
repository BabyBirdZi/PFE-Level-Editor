import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Dashboard.css";
import { clearStoredUser } from "../utils/auth";
import Toast from "../components/Toast";

const PREVIEW_SIZE = 20;

function Dashboard() {
  const [levels, setLevels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [toast, setToast] = useState(null);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameLevelId, setRenameLevelId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLevelId, setDeleteLevelId] = useState(null);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchLevels = async () => {
    try {
      const res = await API.get("/levels");
      setLevels(res.data);
    } catch (error) {
      showToast("Failed to load levels.", "error");
    }
  };

  const handleCreateLevel = async () => {
    try {
      const res = await API.post("/levels", {
        name: "Untitled Level",
        cells: [],
      });

      showToast("New realm created.", "success");
      navigate(`/editor/${res.data._id}`);
    } catch (error) {
      showToast("Error creating level.", "error");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteLevelId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeleteLevelId(null);
  };

  const confirmDeleteLevel = async () => {
    if (!deleteLevelId) return;

    try {
      await API.delete(`/levels/${deleteLevelId}`);
      showToast("Realm deleted successfully.", "success");
      closeDeleteModal();
      fetchLevels();
    } catch (error) {
      showToast("Error deleting realm.", "error");
    }
  };

  const handleEditLevel = (id) => {
    navigate(`/editor/${id}`);
  };

  const handlePlayLevel = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleLogout = () => {
    clearStoredUser();
    showToast("You have been logged out.", "info");
    setTimeout(() => {
      navigate("/login");
    }, 300);
  };

  const openRenameModal = (level) => {
    setRenameLevelId(level._id);
    setRenameValue(level.name);
    setRenameModalOpen(true);
    setOpenMenuId(null);
  };

  const closeRenameModal = () => {
    setRenameModalOpen(false);
    setRenameLevelId(null);
    setRenameValue("");
  };

  const handleRenameSubmit = async () => {
    const targetLevel = levels.find((level) => level._id === renameLevelId);
    if (!targetLevel) return;

    const trimmedName = renameValue.trim();

    if (!trimmedName) {
      showToast("Realm name cannot be empty.", "warning");
      return;
    }

    if (trimmedName === targetLevel.name) {
      closeRenameModal();
      return;
    }

    try {
      await API.put(`/levels/${targetLevel._id}`, {
        name: trimmedName,
        cells: targetLevel.cells || [],
        gridSize: targetLevel.gridSize || PREVIEW_SIZE,
      });

      showToast("Realm renamed successfully.", "success");
      closeRenameModal();
      fetchLevels();
    } catch (error) {
      showToast("Error renaming realm.", "error");
    }
  };

  const handleDuplicateLevel = async (level) => {
    let copyName = `${level.name} Copy`;
    let counter = 2;

    const existingNames = levels.map((item) => item.name.toLowerCase());

    while (existingNames.includes(copyName.toLowerCase())) {
      copyName = `${level.name} Copy ${counter}`;
      counter += 1;
    }

    try {
      await API.post("/levels", {
        name: copyName,
        cells: level.cells || [],
        gridSize: level.gridSize || PREVIEW_SIZE,
      });

      showToast("Realm duplicated successfully.", "success");
      fetchLevels();
    } catch (error) {
      showToast("Error duplicating realm.", "error");
    }

    setOpenMenuId(null);
  };

  const formatUpdatedAt = (dateString) => {
    if (!dateString) return "Unknown date";

    const now = new Date();
    const updated = new Date(dateString);
    const diffMs = now - updated;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return "Just now";
    if (diffMs < hour) return `${Math.floor(diffMs / minute)} min ago`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)} h ago`;

    return updated.toLocaleDateString();
  };

  const getStatusTag = (level) => {
    if (!level.cells || level.cells.length === 0) return "Draft";
    return "Saved";
  };

  const buildPreviewGrid = (cells) => {
    const grid = Array.from({ length: PREVIEW_SIZE * PREVIEW_SIZE }, () => null);

    if (!cells || cells.length === 0) return grid;

    cells.forEach((cell) => {
      const index = cell.y * PREVIEW_SIZE + cell.x;
      if (index >= 0 && index < grid.length && cell.object?.type) {
        grid[index] = cell.object.type;
      }
    });

    return grid;
  };

  useEffect(() => {
    fetchLevels();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredLevels = levels.filter((level) =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <Toast toast={toast} />

      <header className="dashboard-navbar">
        <button className="dashboard-brand dashboard-brand-btn" onClick={() => navigate("/")}>
          <div className="forge-logo-box">▣</div>
          <span>LevelForge</span>
        </button>

        <div className="dashboard-navbar-right">
          <input
            type="text"
            placeholder="Search realms..."
            className="dashboard-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button className="btn-forge btn-green dashboard-logout-green" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-top-section">
          <div>
            <h1>YOUR REALMS</h1>
            <p>Manage, edit, and forge your fantasy environments.</p>
          </div>

          <button className="btn-forge btn-green create-realm-btn" onClick={handleCreateLevel}>
            + Forge New Realm
          </button>
        </div>

        {filteredLevels.length === 0 ? (
          <p className="empty-text">No realms found.</p>
        ) : (
          <div className="dashboard-cards">
            {filteredLevels.map((level) => {
              const previewGrid = buildPreviewGrid(level.cells);

              return (
                <div key={level._id} className="realm-card pixel-card">
                  <div className="realm-preview">
                    <div className="realm-preview-grid">
                      {previewGrid.map((cellType, index) => (
                        <div
                          key={index}
                          className={`preview-cell ${cellType ? `preview-${cellType.toLowerCase()}` : "preview-empty"}`}
                        ></div>
                      ))}
                    </div>

                    <span className={`realm-badge ${getStatusTag(level).toLowerCase()}`}>
                      {getStatusTag(level)}
                    </span>

                    <div className="realm-preview-overlay">
                      <button
                        className="preview-overlay-btn pixel-card-sm"
                        onClick={() => handleEditLevel(level._id)}
                        title="Edit realm"
                      >
                        ✎
                      </button>
                      <button
                        className="preview-overlay-btn pixel-card-sm cyan-hover"
                        onClick={() => handlePlayLevel(level._id)}
                        title="Play/Test realm"
                      >
                        ▶
                      </button>
                    </div>
                  </div>

                  <div className="realm-body">
                    <div className="realm-header-row">
                      <h3>{level.name}</h3>

                      <div className="realm-menu-wrapper" ref={openMenuId === level._id ? menuRef : null}>
                        <button
                          className="realm-menu-btn pixel-card-sm"
                          onClick={() => setOpenMenuId(openMenuId === level._id ? null : level._id)}
                          title="More options"
                        >
                          ⋮
                        </button>

                        {openMenuId === level._id && (
                          <div className="realm-dropdown-menu pixel-card-sm">
                            <button onClick={() => openRenameModal(level)}>Rename</button>
                            <button onClick={() => handleDuplicateLevel(level)}>Duplicate</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="realm-meta-row">
                      <span>{formatUpdatedAt(level.updatedAt)}</span>
                    </div>

                    <div className="realm-actions">
                      <button className="realm-action-btn analyze-btn pixel-card-sm" title="Analyze realm">
                        ✧ Analyze
                      </button>

                      <button
                        className="realm-action-btn delete-btn pixel-card-sm"
                        onClick={() => openDeleteModal(level._id)}
                        title="Delete realm"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {renameModalOpen && (
        <div className="rename-modal-overlay" onClick={closeRenameModal}>
          <div className="rename-modal pixel-card" onClick={(e) => e.stopPropagation()}>
            <h3>Rename Realm</h3>
            <p>Choose a new name for your level.</p>

            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="rename-modal-input"
              placeholder="Enter realm name"
              autoFocus
            />

            <div className="rename-modal-actions">
              <button className="btn-forge btn-dark" onClick={closeRenameModal}>
                Cancel
              </button>
              <button className="btn-forge btn-green" onClick={handleRenameSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div className="rename-modal-overlay" onClick={closeDeleteModal}>
          <div className="rename-modal pixel-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete Realm</h3>
            <p>This action cannot be undone. Do you want to continue?</p>

            <div className="rename-modal-actions">
              <button className="btn-forge btn-dark" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-forge btn-yellow" onClick={confirmDeleteLevel}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;