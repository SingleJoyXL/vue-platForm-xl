import { ElMessageBox, ElNotification } from "element-plus";
import { VXETable } from "vxe-table";

function createConfirmModal(
  title: string,
  message: string,
  confirmButtonText: string,
  cancelButtonText: string
) {
  return VXETable.modal.confirm({
    title: title,
    content: message,
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    status: "warning"
  });
}

function createSuccessModal(title: string, message: string) {
  ElNotification({
    title: title,
    message: message,
    type: "success"
  });
}

function createErrorModal(title: string, message: string) {
  ElMessageBox.alert(message, title, {
    confirmButtonText: "确定",
    type: "error"
  });
}

function createWarningModal(title: string, message: string) {
  ElMessageBox.alert(message, title, {
    confirmButtonText: "确定",
    type: "warning"
  });
}

/**
 * @description: message
 */
export function useMessage() {
  return {
    createConfirmModal,
    createSuccessModal,
    createErrorModal,
    createWarningModal
  };
}
