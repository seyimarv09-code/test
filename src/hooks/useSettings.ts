import { useState, useEffect } from 'react';

export interface Settings {
  theme: 'light' | 'dark' | 'auto';
  defaultPriority: 'low' | 'medium' | 'high';
  confirmDelete: boolean;
  showCompletedTasks: boolean;
  sortBy: 'dueDate' | 'priority' | 'createdAt' | 'manual';
  notifications: boolean;
  autoArchive: boolean;
  archiveDays: number;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  defaultPriority: 'medium',
  confirmDelete: true,
  showCompletedTasks: true,
  sortBy: 'manual',
  notifications: false,
  autoArchive: false,
  archiveDays: 30,
};

const SETTINGS_KEY = 'chronos-settings';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
  };
}
