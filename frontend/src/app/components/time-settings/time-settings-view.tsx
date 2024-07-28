'use client';

import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  BellIcon,
  BoltIcon,
  ClockIcon,
  CogIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, TimeSettings, TimeSettingsService } from '@api';
import { useModalContext } from '@context/modal/modal-context';
import TimeSettingsCreate from './time-settings-create';
import useToast from '@context/toasts/toast-context';
import { Tooltip } from 'react-tooltip';
import React, { useState } from 'react';

const TimeSettingsModal: React.FC = () => {
  const { showModal } = useModalContext();
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const { data: timeSettings = [] } = useQuery<TimeSettings[]>({
    queryKey: ['timeSettings'],
    queryFn: () => TimeSettingsService.readTimeSettingsListTimeSetttingsGet(),
  });

  const sortedTimeSettings = [...timeSettings].sort((a, b) => a.id - b.id);

  const updateTimeSettingsMutation = useMutation({
    mutationFn: (settings: TimeSettings) =>
      TimeSettingsService.updateTimeSettingsTimeSetttingsTimeSettingsIdPatch(settings.id, { is_selected: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSettings'] });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to update time settings';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const deleteTimeSettingsMutation = useMutation({
    mutationFn: (id: number) => TimeSettingsService.deleteTimeSettingsTimeSetttingsTimeSettingsIdDelete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSettings'] });
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to delete time settings';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleSelect = (settings: TimeSettings) => {
    updateTimeSettingsMutation.mutate(settings);
  };

  const handleDelete = (id: number) => {
    deleteTimeSettingsMutation.mutate(id);
  };

  const handleCreate = () => {
    showModal({
      type: 'default',
      title: 'Create Time Setting',
      content: <TimeSettingsCreate />,
    });
  };

  const handleEdit = (settings: TimeSettings) => {
    // This is a placeholder for the edit functionality
    console.log('Edit settings:', settings);
  };

  return (
    <div className="bg-white rounded-lg w-full p-4">
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 mx-px px-3">
        <ClockIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Type" />
        <PlayIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Duration" />
        <PauseIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Short Break" />
        <MoonIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Long Break" />
        <ArrowPathIcon
          className="h-5 w-5"
          data-tooltip-id="icon-tooltip"
          data-tooltip-content="Number of sessions till Long Break"
        />
        <BellIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Sound" />
        <BoltIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Sound reminder interval" />
      </div>

      <div className="max-h-80 overflow-y-auto mb-4">
        {sortedTimeSettings.length > 0 ? (
          sortedTimeSettings.map((settings) => (
            <div
              key={settings.id}
              className={`relative flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${settings.is_selected ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelect(settings)}
              onMouseEnter={() => setHoveredId(settings.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-6 flex justify-center">
                  {settings.is_countdown ? (
                    <ArrowDownCircleIcon className="h-5 w-5 text-blue-500" aria-label="Timer" />
                  ) : (
                    <ArrowUpCircleIcon className="h-5 w-5 text-green-500" aria-label="Open" />
                  )}
                </span>
                <span className="w-8 text-center">{settings.duration}</span>
                <span className="w-8 text-center">{settings.short_break_duration}</span>
                <span className="w-8 text-center">{settings.long_break_duration}</span>
                <span className="w-8 text-center">{settings.long_break_interval}</span>
                <BellIcon className={`h-6 w-6 ${settings.is_sound ? 'text-yellow-500' : 'text-gray-300'}`} />
                <span className="w-8 text-center">{settings.sound_interval}</span>
              </div>
              {hoveredId === settings.id && (
                <div className="absolute right-2 flex space-x-2 bg-gray-800 bg-opacity-90 rounded p-1">
                  <CogIcon
                    className="h-5 w-5 text-white hover:text-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(settings);
                    }}
                  />
                  <TrashIcon
                    className="h-5 w-5 text-red-500 hover:text-red-400"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(settings.id);
                    }}
                  />
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-700 font-semibold">You have no Time Settings</p>
        )}
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" onClick={handleCreate}>
        Create New Setting
      </button>

      <Tooltip id="icon-tooltip" />
    </div>
  );
};

export default TimeSettingsModal;
