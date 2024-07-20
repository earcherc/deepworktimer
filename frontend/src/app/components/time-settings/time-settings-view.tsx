'use client';

import { CheckIcon, ClockIcon, SpeakerWaveIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, TimeSettings, TimeSettingsService } from '@api';
import { useModalContext } from '@context/modal/modal-context';
import TimeSettingsCreate from './time-settings-create';
import useToast from '@context/toasts/toast-context';
import React from 'react';

const TimeSettingsModal: React.FC = () => {
  const { showModal } = useModalContext();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { data: timeSettings = [] } = useQuery<TimeSettings[]>({
    queryKey: ['timeSettings'],
    queryFn: () => TimeSettingsService.readTimeSettingsListTimeSetttingsGet(),
  });

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

  return (
    <div className=" bg-white rounded-lg shadow-xl p-6 w-full">
      <div className="flex flex-nowrap mb-4 text-sm text-gray-500">
        <p>Type | Duration | S-Break | L-Break | Sessions till L-Break | Sound | Sound Interval</p>
      </div>

      <div className="max-h-80 overflow-y-auto mb-4">
        {timeSettings.length > 0 ? (
          timeSettings.map((settings) => (
            <div
              key={settings.id}
              className={`flex items-center justify-between p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-100 ${settings.is_selected ? 'bg-blue-100' : ''}`}
              onClick={() => handleSelect(settings)}
            >
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <span className="font-semibold">{settings.is_countdown ? 'Timer' : 'Open'}</span>
                <span>{settings.duration}</span>
                <span>{settings.short_break_duration}</span>
                <span>{settings.long_break_duration}</span>
                <span>{settings.long_break_interval}</span>
                {settings.is_sound && <SpeakerWaveIcon className="h-5 w-5 text-gray-400" />}
                <span>{settings.sound_interval}</span>
                {settings.is_selected && <CheckIcon className="h-5 w-5 text-green-500" />}
              </div>
              <TrashIcon
                className="h-5 w-5 text-red-500 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(settings.id);
                }}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-700 font-medium">No Time Settings</p>
        )}
      </div>

      <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600" onClick={handleCreate}>
        Create New Setting
      </button>
    </div>
  );
};

export default TimeSettingsModal;
