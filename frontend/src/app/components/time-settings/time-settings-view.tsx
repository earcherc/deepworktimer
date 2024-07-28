'use client';

import {
  ArrowDownCircleIcon,
  ArrowPathIcon,
  ArrowUpCircleIcon,
  BellIcon,
  BoltIcon,
  ClockIcon,
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
      TimeSettingsService.updateTimeSettingsTimeSetttingsTimeSettingsIdPatch(settings.id, {
        is_selected: !settings.is_selected,
      }),
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
      message: 'Use the default values for ideal productivity, or create your own.',
      content: <TimeSettingsCreate />,
    });
  };

  return (
    <div className="bg-white rounded-lg w-full p-4">
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 mx-px px-3">
        <ClockIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Time mode" />
        <PlayIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Work session duration" />
        <PauseIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Short break duration" />
        <MoonIcon className="h-5 w-5" data-tooltip-id="icon-tooltip" data-tooltip-content="Long break duration" />
        <ArrowPathIcon
          className="h-5 w-5"
          data-tooltip-id="icon-tooltip"
          data-tooltip-content="Number of sessions till a long break"
        />
        <BellIcon
          className="h-5 w-5"
          data-tooltip-id="icon-tooltip"
          data-tooltip-content="Play sound at the end of each session"
        />
        <BoltIcon
          className="h-5 w-5"
          data-tooltip-id="icon-tooltip"
          data-tooltip-content="Sound reminder at regular intervals (minutes) "
        />
      </div>

      <div className="max-h-80 overflow-y-auto mb-4 space-y-2">
        {sortedTimeSettings.length > 0 ? (
          sortedTimeSettings.map((settings) => (
            <div
              key={settings.id}
              className={`relative flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                settings.is_selected
                  ? 'bg-blue-400 text-white hover:bg-blue-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => handleSelect(settings)}
              onMouseEnter={() => setHoveredId(settings.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="w-6 flex justify-center">
                  {settings.is_countdown ? (
                    <ArrowDownCircleIcon
                      className={`h-6 w-6 ${settings.is_selected ? 'text-white' : 'text-blue-500'}`}
                      aria-label="Timer"
                    />
                  ) : (
                    <ArrowUpCircleIcon
                      className={`h-6 w-6 ${settings.is_selected ? 'text-white' : 'text-green-500'}`}
                      aria-label="Open"
                    />
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

      <button
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
        onClick={handleCreate}
      >
        Create New Setting
      </button>

      <Tooltip id="icon-tooltip" />
    </div>
  );
};

export default TimeSettingsModal;
