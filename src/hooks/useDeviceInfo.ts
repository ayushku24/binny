import { useEffect, useState } from "react";
import {
  DeviceInfo,
  getDetailedDeviceInfo,
  getDeviceInfo,
  simulatedNativeModule,
} from "../utils/deviceInfo";

export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<any>(null);
  const [nativeModuleInfo, setNativeModuleInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeviceInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get basic device info using Expo modules
        const basicInfo = await getDeviceInfo();
        setDeviceInfo(basicInfo);

        // Get detailed device info
        const detailed = await getDetailedDeviceInfo();
        setDetailedInfo(detailed);

        // Simulate native module call
        const nativeInfo = await simulatedNativeModule.getOSVersion();
        const systemInfo = await simulatedNativeModule.getSystemInfo();
        setNativeModuleInfo({ ...nativeInfo, ...systemInfo });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDeviceInfo();
  }, []);

  const refreshDeviceInfo = async () => {
    const fetchDeviceInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get basic device info using Expo modules
        const basicInfo = await getDeviceInfo();
        setDeviceInfo(basicInfo);

        // Get detailed device info
        const detailed = await getDetailedDeviceInfo();
        setDetailedInfo(detailed);

        // Simulate native module call
        const nativeInfo = await simulatedNativeModule.getOSVersion();
        const systemInfo = await simulatedNativeModule.getSystemInfo();
        setNativeModuleInfo({ ...nativeInfo, ...systemInfo });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    await fetchDeviceInfo();
  };

  return {
    deviceInfo,
    detailedInfo,
    nativeModuleInfo,
    loading,
    error,
    refreshDeviceInfo,
  };
};

// Hook for just basic device info
export const useBasicDeviceInfo = () => {
  const [info, setInfo] = useState<DeviceInfo | null>(null);

  useEffect(() => {
    getDeviceInfo().then(setInfo);
  }, []);

  return info;
};

// Hook for native module demonstration
export const useNativeModuleDemo = () => {
  const [nativeData, setNativeData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const callNativeModule = async () => {
    try {
      setLoading(true);

      // This would be a real native module call in production
      const osInfo = await simulatedNativeModule.getOSVersion();
      const systemInfo = await simulatedNativeModule.getSystemInfo();

      setNativeData({
        timestamp: new Date().toISOString(),
        osInfo,
        systemInfo,
        demonstration: "This simulates calling a native iOS/Android module",
        realImplementation: "In production, this would call actual native code",
      });
    } catch (error) {
      console.error("Native module call failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    nativeData,
    loading,
    callNativeModule,
  };
};
