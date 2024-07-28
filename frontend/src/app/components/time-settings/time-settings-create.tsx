'use client';

import {
  ArrowPathIcon,
  BellIcon,
  BoltIcon,
  ClockIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/20/solid';
import { ApiError, TimeSettingsCreate as TimeSettingsCreateType, TimeSettingsService } from '@api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useModalContext } from '@context/modal/modal-context';
import { Controller, useForm } from 'react-hook-form';
import useToast from '@context/toasts/toast-context';
import { Switch } from '@headlessui/react';
import { Tooltip } from 'react-tooltip';
import React from 'react';

const TimeSettingsCreate: React.FC = () => {
  const { hideModal } = useModalContext();
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  const { control, handleSubmit, watch, setValue } = useForm<TimeSettingsCreateType>({
    defaultValues: {
      is_countdown: true,
      duration: 50,
      short_break_duration: 2,
      long_break_duration: 30,
      long_break_interval: 4,
      is_sound: true,
      sound_interval: undefined,
    },
    mode: 'onChange',
  });

  const isCountdown = watch('is_countdown');

  const createTimeSettingsMutation = useMutation({
    mutationFn: (newSettings: TimeSettingsCreateType) =>
      TimeSettingsService.createTimeSettingsTimeSetttingsPost(newSettings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeSettings'] });
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

  const onSubmit = (data: TimeSettingsCreateType) => {
    createTimeSettingsMutation.mutate(data);
  };

  const handleModeChange = (mode: boolean) => {
    setValue('is_countdown', mode);
    if (mode) {
      setValue('sound_interval', undefined);
    } else {
      setValue('duration', undefined);
      setValue('short_break_duration', undefined);
      setValue('long_break_duration', undefined);
      setValue('long_break_interval', undefined);
      setValue('sound_interval', 20);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ClockIcon className="h-5 w-5 text-gray-400" />
          <label className="ml-2 font-bold">Mode</label>
          <QuestionMarkCircleIcon data-tooltip-id="tooltip-mode" className="h-4 w-4 text-gray-400 ml-1 cursor-help" />
          <Tooltip id="tooltip-mode" content="Choose between countdown or stopwatch" />
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => handleModeChange(true)}
            className={`px-3 py-1 rounded-md ${isCountdown ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Timer
          </button>
          <button
            type="button"
            onClick={() => handleModeChange(false)}
            className={`px-3 py-1 rounded-md ${!isCountdown ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Stopwatch
          </button>
        </div>
      </div>

      {isCountdown && (
        <>
          <div className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PlayIcon className="h-5 w-5 text-gray-400" />
                <label className="ml-2 font-bold">Duration</label>
                <QuestionMarkCircleIcon
                  data-tooltip-id="tooltip-duration"
                  className="h-4 w-4 text-gray-400 ml-1 cursor-help"
                />
                <Tooltip id="tooltip-duration" content="Duration of each work session (minutes)" />
              </div>
              <Controller
                name="duration"
                control={control}
                rules={{ required: 'This field is required', min: { value: 1, message: 'Must be at least 1' } }}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col items-end">
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <PauseIcon className="h-5 w-5 text-gray-400" />
                <label className="ml-2 font-bold">Short break duration</label>
                <QuestionMarkCircleIcon
                  data-tooltip-id="tooltip-short-break"
                  className="h-4 w-4 text-gray-400 ml-1 cursor-help"
                />
                <Tooltip id="tooltip-short-break" content="Duration of short breaks between work sessions (minutes)" />
              </div>
              <Controller
                name="short_break_duration"
                control={control}
                rules={{ required: 'This field is required', min: { value: 1, message: 'Must be at least 1' } }}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col items-end">
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MoonIcon className="h-5 w-5 text-gray-400" />
                <label className="ml-2 font-bold">Long break duration</label>
                <QuestionMarkCircleIcon
                  data-tooltip-id="tooltip-long-break"
                  className="h-4 w-4 text-gray-400 ml-1 cursor-help"
                />
                <Tooltip
                  id="tooltip-long-break"
                  content="Duration of long break after completing multiple sessions (minutes)"
                />
              </div>
              <Controller
                name="long_break_duration"
                control={control}
                rules={{ required: 'This field is required', min: { value: 1, message: 'Must be at least 1' } }}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col items-end">
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowPathIcon className="h-5 w-5 text-gray-400" />
                <label className="ml-2 font-bold">Take long break after</label>
                <QuestionMarkCircleIcon
                  data-tooltip-id="tooltip-long-break-interval"
                  className="h-4 w-4 text-gray-400 ml-1 cursor-help"
                />
                <Tooltip id="tooltip-long-break-interval" content="Number of work sessions before a long break" />
              </div>
              <Controller
                name="long_break_interval"
                control={control}
                rules={{ required: 'This field is required', min: { value: 2, message: 'Must be at least 2' } }}
                render={({ field, fieldState: { error } }) => (
                  <div className="flex flex-col items-end">
                    <input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                      className={`w-20 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${
                        error ? 'border-red-500' : ''
                      }`}
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          <div className="py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 text-gray-400" />
                <label className="ml-2 font-bold">End bell</label>
                <QuestionMarkCircleIcon
                  data-tooltip-id="tooltip-end-bell"
                  className="h-4 w-4 text-gray-400 ml-1 cursor-help"
                />
                <Tooltip id="tooltip-end-bell" content="Play a sound at end of each session" />
              </div>
              <Controller
                name="is_sound"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onChange={field.onChange}
                    className={`${field.value ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span
                      className={`${field.value ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                )}
              />
            </div>
          </div>
        </>
      )}

      <div className="py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BoltIcon className="h-5 w-5 text-gray-400" />
            <label className="ml-2 font-bold">Reminder sound</label>
            <QuestionMarkCircleIcon
              data-tooltip-id="tooltip-reminder-sound"
              className="h-4 w-4 text-gray-400 ml-1 cursor-help"
            />
            <Tooltip
              id="tooltip-reminder-sound"
              content="Play sound at regularly spaced intervals (minutes) through session"
            />
          </div>
          <Controller
            name="sound_interval"
            control={control}
            rules={{ min: { value: 1, message: 'Must be at least 1' } }}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.value !== undefined}
                    onChange={(checked) => field.onChange(checked ? 20 : undefined)}
                    disabled={!isCountdown}
                    className={`${
                      field.value !== undefined ? 'bg-blue-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full ${
                      !isCountdown ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <span
                      className={`${
                        field.value !== undefined ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white`}
                    />
                  </Switch>
                  {field.value !== undefined && (
                    <input
                      type="number"
                      value={field.value === undefined ? '' : field.value}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '') {
                          field.onChange(null);
                        } else {
                          field.onChange(Number(newValue));
                        }
                      }}
                      className={`w-16 text-right rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 ${error ? 'border-red-500' : ''}`}
                    />
                  )}
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
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
