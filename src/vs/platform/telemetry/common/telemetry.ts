/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { createDecorator } from '../../../../vs/platform/instantiation/common/instantiation';
import {
  ClassifiedEvent,
  StrictPropertyCheck,
  GDPRClassification,
} from '../../../../vs/platform/telemetry/common/gdprTypings';

export const ITelemetryService =
  createDecorator<ITelemetryService>('telemetryService');

export interface ITelemetryInfo {
  sessionId: string;
  machineId: string;
  instanceId: string;
  firstSessionDate: string;
  msftInternal?: boolean;
}

export interface ITelemetryData {
  from?: string;
  target?: string;
  [key: string]: any;
}

export interface ITelemetryService {
  readonly _serviceBrand: undefined;

  publicLog2<
    E extends ClassifiedEvent<T> = never,
    T extends GDPRClassification<T> = never
  >(
    eventName: string,
    data?: StrictPropertyCheck<T, E>,
    anonymizeFilePaths?: boolean
  ): Promise<void>;
}

export interface ITelemetryEndpoint {
  id: string;
  aiKey: string;
  sendErrorTelemetry: boolean;
}

export const ICustomEndpointTelemetryService =
  createDecorator<ICustomEndpointTelemetryService>(
    'customEndpointTelemetryService'
  );

export interface ICustomEndpointTelemetryService {
  readonly _serviceBrand: undefined;

  publicLog(
    endpoint: ITelemetryEndpoint,
    eventName: string,
    data?: ITelemetryData
  ): Promise<void>;
  publicLogError(
    endpoint: ITelemetryEndpoint,
    errorEventName: string,
    data?: ITelemetryData
  ): Promise<void>;
}

// Keys
export const instanceStorageKey = 'telemetry.instanceId';
export const currentSessionDateStorageKey = 'telemetry.currentSessionDate';
export const firstSessionDateStorageKey = 'telemetry.firstSessionDate';
export const lastSessionDateStorageKey = 'telemetry.lastSessionDate';
export const machineIdKey = 'telemetry.machineId';
