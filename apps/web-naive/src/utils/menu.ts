import { getPublicConfig } from "@/api/base";

export function getPlatform() {
  return new Promise<string>((resolve, reject) => {
    getPublicConfig("PLATFORM-NAME")
      .then(res => {
        if (res.data === "长江电力工业互联网平台") {
          resolve("changdian");
        } else {
          resolve("");
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
