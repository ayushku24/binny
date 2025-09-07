import Constants from "expo-constants";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Types for device information
export interface DeviceInfo {
  osVersion: string;
  osName: string;
  deviceModel: string;
  deviceBrand: string;
  isDevice: boolean;
  isEmulator: boolean;
}

/**
 * Get device OS version and information using Expo modules
 * This is the recommended approach for Expo managed workflow
 */
export const getDeviceInfo = async (): Promise<DeviceInfo> => {
  return {
    osVersion: String(Platform.Version),
    osName: Platform.OS,
    deviceModel: Device.modelName || "Unknown Model",
    deviceBrand: Device.brand || "Unknown Brand",
    isDevice: Device.isDevice || false,
    isEmulator: !(Device.isDevice || false),
  };
};

/**
 * Get detailed system information
 */
export const getDetailedDeviceInfo = async () => {
  const baseInfo = await getDeviceInfo();

  return {
    ...baseInfo,
    // Expo-specific information
    expoVersion: Constants.expoConfig?.sdkVersion || "Unknown",
    appVersion: Constants.expoConfig?.version || "1.0.0",
    appName: Constants.expoConfig?.name || "Unknown App",
    platform: Platform.OS === "ios" ? "iOS" : "Android",
    platformVersion: String(Platform.Version),

    // Additional device info
    deviceName: Device.deviceName,
    totalMemory: Device.totalMemory,
    supportedCpuArchitectures: Device.supportedCpuArchitectures,

    // Runtime information
    isRunningInExpoGo: Constants.appOwnership === "expo",
    isDevelopment: __DEV__,

    // Screen information (if available)
    screenData: {
      // Would need to use Dimensions API or expo-screen-orientation
      // for more detailed screen info
    },
  };
};

/**
 * Native Module Implementation Concept
 *
 * For bare React Native or Expo Development Build, you would create:
 *
 * 1. iOS Native Module (DeviceInfoModule.swift):
 * ```swift
 * import UIKit
 *
 * @objc(DeviceInfoModule)
 * class DeviceInfoModule: NSObject, RCTBridgeModule {
 *   static func moduleName() -> String! {
 *     return "DeviceInfoModule"
 *   }
 *
 *   @objc
 *   static func requiresMainQueueSetup() -> Bool {
 *     return false
 *   }
 *
 *   @objc
 *   func getOSVersion(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
 *     let version = UIDevice.current.systemVersion
 *     let osName = UIDevice.current.systemName
 *
 *     resolve([
 *       "osVersion": version,
 *       "osName": osName,
 *       "deviceModel": UIDevice.current.model,
 *       "deviceName": UIDevice.current.name
 *     ])
 *   }
 * }
 * ```
 *
 * 2. Android Native Module (DeviceInfoModule.java):
 * ```java
 * package com.yourapp.deviceinfo;
 *
 * import android.os.Build;
 * import com.facebook.react.bridge.Promise;
 * import com.facebook.react.bridge.ReactApplicationContext;
 * import com.facebook.react.bridge.ReactContextBaseJavaModule;
 * import com.facebook.react.bridge.ReactMethod;
 * import com.facebook.react.bridge.WritableMap;
 * import com.facebook.react.bridge.Arguments;
 *
 * public class DeviceInfoModule extends ReactContextBaseJavaModule {
 *
 *   public DeviceInfoModule(ReactApplicationContext reactContext) {
 *     super(reactContext);
 *   }
 *
 *   @Override
 *   public String getName() {
 *     return "DeviceInfoModule";
 *   }
 *
 *   @ReactMethod
 *   public void getOSVersion(Promise promise) {
 *     try {
 *       WritableMap map = Arguments.createMap();
 *       map.putString("osVersion", Build.VERSION.RELEASE);
 *       map.putString("osName", "Android");
 *       map.putString("deviceModel", Build.MODEL);
 *       map.putString("deviceBrand", Build.BRAND);
 *       promise.resolve(map);
 *     } catch (Exception e) {
 *       promise.reject("GET_OS_VERSION_ERROR", e.getMessage());
 *     }
 *   }
 * }
 * ```
 *
 * 3. TypeScript Interface:
 * ```typescript
 * import { NativeModules } from 'react-native';
 *
 * interface DeviceInfoModuleInterface {
 *   getOSVersion(): Promise<{
 *     osVersion: string;
 *     osName: string;
 *     deviceModel: string;
 *     deviceBrand?: string;
 *     deviceName?: string;
 *   }>;
 * }
 *
 * const { DeviceInfoModule } = NativeModules;
 * export default DeviceInfoModule as DeviceInfoModuleInterface;
 * ```
 *
 * 4. Usage:
 * ```typescript
 * import DeviceInfoModule from './DeviceInfoModule';
 *
 * const getDeviceInfo = async () => {
 *   try {
 *     const info = await DeviceInfoModule.getOSVersion();
 *     console.log('Device Info:', info);
 *     return info;
 *   } catch (error) {
 *     console.error('Failed to get device info:', error);
 *     throw error;
 *   }
 * };
 * ```
 */

// Simulated native module for demonstration
class SimulatedNativeModule {
  /**
   * Simulates what a native module would return
   * In a real native module, this would call native iOS/Android code
   */
  async getOSVersion(): Promise<{
    osVersion: string;
    osName: string;
    deviceModel: string;
    deviceBrand: string;
    nativeModuleUsed: boolean;
  }> {
    // Simulate native module delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return {
      osVersion: String(Platform.Version),
      osName: Platform.OS === "ios" ? "iOS" : "Android",
      deviceModel: Device.modelName || "Simulated Device",
      deviceBrand: Device.brand || "Simulated Brand",
      nativeModuleUsed: false, // Would be true in real native module
    };
  }

  /**
   * Get more detailed system information
   * This would access native APIs directly
   */
  async getSystemInfo(): Promise<{
    cpuArchitecture: string;
    totalMemory: number;
    availableMemory: number;
    batteryLevel: number;
    isCharging: boolean;
    networkType: string;
  }> {
    // Simulate native calls
    await new Promise((resolve) => setTimeout(resolve, 150));

    return {
      cpuArchitecture: Device.supportedCpuArchitectures?.[0] || "unknown",
      totalMemory: Device.totalMemory || 0,
      availableMemory: Math.random() * 1000000000, // Simulated
      batteryLevel: Math.random(), // Would get from native battery API
      isCharging: Math.random() > 0.5, // Would get from native power API
      networkType: "wifi", // Would get from native network API
    };
  }
}

export const simulatedNativeModule = new SimulatedNativeModule();

/**
 * Instructions for implementing real native modules:
 *
 * For Expo Managed Workflow:
 * - Use expo-dev-client for development builds
 * - Create config plugins for native code
 * - Use Expo Modules API (preferred)
 *
 * For Bare React Native:
 * - Create native iOS and Android modules
 * - Register modules in respective native projects
 * - Use React Native bridge for communication
 *
 * Modern Approach (Expo Modules):
 * - Use Expo Modules API with TypeScript
 * - Write once, works on both platforms
 * - Better type safety and development experience
 */
