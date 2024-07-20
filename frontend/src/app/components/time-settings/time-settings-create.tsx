'use client';

import { ArrowPathIcon, BellIcon, BoltIcon, ClockIcon, MoonIcon, PauseIcon, PlayIcon } from '@heroicons/react/20/solid';
import { ApiError, TimeSettingsCreate as TimeSettingsCreateType, TimeSettingsService } from '@api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@context/modal/modal-context';
import useToast from '@context/toasts/toast-context';
import { Switch } from '@headlessui/react';
import React, { useState } from 'react';

const TimeSettingsCreate: React.FC = () => {
  const { hideModal } = useModalContext();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TimeSettingsCreateType>({
    is_countdown: true,
    duration: 55,
    short_break_duration: 5,
    long_break_duration: 30,
    long_break_interval: 6,
    is_sound: true,
    sound_interval: undefined,
  });

  const createTimeSettingsMutation = useMutation({
    mutationFn: (newSettings: TimeSettingsCreateType) =>
      TimeSettingsService.createTimeSettingsTimeSetttingsPost(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSettings'] });
      addToast({ type: 'success', content: 'Time settings created successfully' });
      hideModal();
    },
    onError: (error: unknown) => {
      let errorMessage = 'Failed to create time settings';
      if (error instanceof ApiError) {
        errorMessage = error.body?.detail || errorMessage;
      }
      addToast({ type: 'error', content: errorMessage });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    setFormData((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : Math.max(1, numValue), // Ensure minimum value is 1
    }));
  };

  const handleModeChange = (isCountdown: boolean) => {
    setFormData((prev) => ({
      ...prev,
      is_countdown: isCountdown,
      duration: isCountdown ? 55 : undefined,
      short_break_duration: isCountdown ? 5 : undefined,
      long_break_duration: isCountdown ? 30 : undefined,
      long_break_interval: isCountdown ? 6 : undefined,
      is_sound: true,
      sound_interval: isCountdown ? undefined : 20,
    }));
  };

  const handleEndBellChange = (checked: boolean) => {
    if (formData.is_countdown) {
      setFormData((prev) => ({ ...prev, is_sound: checked }));
    }
  };

  const handleReminderSoundChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sound_interval: checked ? 20 : undefined }));
  };

  const InputField = ({
    label,
    name,
    icon,
    value,
    disabled = false,
  }: {
    label: string;
    name: string;
    icon: React.ReactNode;
    value: number | undefined;
    disabled?: boolean;
  }) => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        {icon}
        <label className="ml-2 font-bold">{label}</label>
      </div>
      <input
        type="number"
        name={name}
        value={value ?? ''}
        onChange={handleInputChange}
        disabled={disabled}
        min={1}
        className={`w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTimeSettingsMutation.mutate(formData);
      }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <label className="ml-2 font-bold">Mode</label>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleModeChange(true)}
            className={`px-3 py-1 rounded-md ${formData.is_countdown ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Timer
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(false)}
            className={`px-3 py-1 rounded-md ${!formData.is_countdown ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Open
          </button>
        </div>
      </div>

      {formData.is_countdown && (
        <>
          <InputField
            label="Duration"
            name="duration"
            icon={<PlayIcon className="h-5 w-5 text-gray-400" />}
            value={formData.duration}
          />
          <InputField
            label="Short break duration"
            name="short_break_duration"
            icon={<PauseIcon className="h-5 w-5 text-gray-400" />}
            value={formData.short_break_duration}
          />
          <InputField
            label="Long break duration"
            name="long_break_duration"
            icon={<MoonIcon className="h-5 w-5 text-gray-400" />}
            value={formData.long_break_duration}
          />
          <InputField
            label="Take long break after"
            name="long_break_interval"
            icon={<ArrowPathIcon className="h-5 w-5 text-gray-400" />}
            value={formData.long_break_interval}
          />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <BellIcon className="h-5 w-5 text-gray-400" />
              <label className="ml-2 font-bold">End bell</label>
            </div>
            <Switch
              checked={formData.is_sound}
              onChange={handleEndBellChange}
              className={`${formData.is_sound ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span
                className={`${formData.is_sound ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`}
              />
            </Switch>
          </div>
        </>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <BoltIcon className="h-5 w-5 text-gray-400" />
          <label className="ml-2 font-bold">Reminder sound</label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={formData.sound_interval !== undefined}
            onChange={handleReminderSoundChange}
            disabled={!formData.is_countdown}
            className={`${
              formData.sound_interval !== undefined ? 'bg-blue-600' : 'bg-gray-200'
            } relative inline-flex h-6 w-11 items-center rounded-full ${
              !formData.is_countdown ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span
              className={`${
                formData.sound_interval !== undefined ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white`}
            />
          </Switch>
          {formData.sound_interval !== undefined && (
            <input
              type="number"
              name="sound_interval"
              value={formData.sound_interval}
              onChange={handleInputChange}
              min={1}
              className="w-16 text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          )}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={hideModal}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Create
        </button>
      </div>
    </form>
  );
};

export default TimeSettingsCreate;
