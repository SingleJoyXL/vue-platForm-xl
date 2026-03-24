import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          "/dataAssetService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            // target: "http://10.2.1.175:8082",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/dataAssetServicee/, "dataAssetService")
          },
          "/projectFormService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            // target: "http://10.2.1.175:8082",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/projectFormService/, "projectFormService")
          },
          "/avatar": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/avatar/, "avatar")
          },
          "/dataService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dataService/, "dataService")
          },
          "/deviceobject": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/deviceobject/, "deviceobject")
          },
          "/panoramaDataService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/panoramaDataService/, "panoramaDataService")
          },
          "/deviceObject": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            // target: "http://127.0.0.1:8080",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/deviceObject/, "deviceObject")
          },
          "/portal-prod-api": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/portal-prod-api/, "portal-prod-api")
          },
          "/workflowService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/workflowService/, "workflowService")
          },
          "/dataNameService": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dataNameService/, "dataNameService")
          },
          "/workflow": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/workflow/, "workflow")
          },
          "/pipeline": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/pipeline/, "pipeline")
          },
          "/dataQuality": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dataQuality/, "dataQuality")
          },
          "/eventManage": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/eventManage/, "eventManage")
          },
          "/fta": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/fta/, "fta")
          },
          "/node-red": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/node-red/, "node-red")
          },
          "/dataAssetObjectBuild": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/dataAssetObjectBuild/, "dataAssetObjectBuild")
          },
          "/analysis": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/analysis/, "analysis")
          },
          "/cf": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/cf/, "cf")
          },
          "/sheet": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/sheet/, "sheet")
          },
          "/industry-diagram": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/industry-diagram/, "industry-diagram")
          },
          "/dataName": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dataName/, "dataName")
          },
          "/samplerepository": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/samplerepository/, "samplerepository")
          },
          "/fmeaPlus": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/fmeaPlus/, "fmeaPlus")
          },
          "/failureCaseLibrary": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path =>
              path.replace(/^\/failureCaseLibrary/, "failureCaseLibrary")
          },
          "/dashboard": {
            // 这里填写后端地址
            target: "http://172.16.15.180",
            changeOrigin: true,
            rewrite: path => path.replace(/^\/dashboard/, "dashboard")
          }
        },
      },
    },
  };
});
