export const filterDataAssetType = (type: any) => {
  let name = "";
  switch (type) {
    case 1:
      name = "时序数据";
      break;
    case 2:
      name = "结构化";
      break;
    case 3:
      name = "非结构化";
      break;
    case 4:
      name = "模型";
      break;
    case 5:
      name = "方法";
      break;
    case 6:
      name = "事件";
      break;
  }
  return name;
};
export const filterDataTypeCommon = (type: any) => {
  let name = "";
  switch (type) {
    case 0:
      name = "量测数据";
      break;
    case 1:
      name = "";
      break;
    case 2:
      name = "非结构化数据";
      break;
    case 3:
      name = "算法";
      break;
    case 4:
      name = "规则";
      break;
    case 5:
      name = "指标";
      break;
    case 6:
      name = "字典";
      break;
    case 7:
      name = "知识库";
      break;
    case 8:
      name = "故障案例库";
      break;
    case 9:
      name = "FTA故障树";
      break;
    case 10:
      name = "样本库";
      break;
    case 11:
      name = "数据集";
      break;
  }
  return name;
};
