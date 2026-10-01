import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';

const SidebarTableContext = createContext(null);

export const SidebarTableProvider = ({ children }) => {
  const [tableVisible, setTableVisible] = useState(true);
  const [activePath, setActivePath] = useState(null);
  const exitModeCallbacks = useRef(new Set());

  const toggleTable = useCallback(() => {
    setTableVisible((prev) => !prev);
  }, []);

  const showTable = useCallback(() => {
    setTableVisible(true);
  }, []);

  const hideTable = useCallback(() => {
    setTableVisible(false);
  }, []);

  const registerExitMode = useCallback((callback) => {
    exitModeCallbacks.current.add(callback);
    return () => exitModeCallbacks.current.delete(callback);
  }, []);

  const triggerExitMode = useCallback(() => {
    exitModeCallbacks.current.forEach((cb) => cb());
  }, []);

  const handleActiveLinkClick = useCallback((path) => {
    // Always exit mode and show table - don't toggle/hide on active link click
    triggerExitMode();
    setActivePath(path);
    setTableVisible(true);
  }, [triggerExitMode]);

  const handleModeChange = useCallback((isInMode) => {
    if (isInMode) {
      setTableVisible(false);
    } else {
      setTableVisible(true);
    }
  }, []);

  const value = useMemo(
    () => ({
      tableVisible,
      toggleTable,
      showTable,
      hideTable,
      handleActiveLinkClick,
      handleModeChange,
      activePath,
      registerExitMode,
    }),
    [tableVisible, toggleTable, showTable, hideTable, handleActiveLinkClick, handleModeChange, activePath, registerExitMode]
  );

  return <SidebarTableContext.Provider value={value}>{children}</SidebarTableContext.Provider>;
};

export const useSidebarTable = () => {
  const context = useContext(SidebarTableContext);
  if (!context) {
    throw new Error('useSidebarTable must be used within a SidebarTableProvider');
  }
  return context;
};

export default SidebarTableContext;