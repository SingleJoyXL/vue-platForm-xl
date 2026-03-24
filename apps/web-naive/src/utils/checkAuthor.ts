import { judgeAuthor } from "@/api/base";
import { useUserStoreHook } from "@/store/modules/user";

export const checkAuthor = (url: string) => {
  const userId = useUserStoreHook().id;
  const data = {
    url,
    userId
  };
  return new Promise<boolean>((resolve, reject) => {
    judgeAuthor(data)
      .then(res => {
        resolve(res.data);
        // resolve(true);
      })
      .catch(error => {
        reject(error);
      });
  });
};
