import { defHttp } from "#/utils/http";

enum Api {
  getMenuList = "/avatar/sys/author/queryMenuTree"
}

export type MenuItem = {
  authObjectDesc: string;
  authObjectUrl: string;
  defaultUrl: string;
  children: MenuItem[];
};

type MenuResult = {
  statusCode: number;
  repMessage: string;
  data: MenuItem[];
};

export const getMenuList = (userId: string) => {
  return defHttp.post<MenuResult>(
    {
      url: `${Api.getMenuList}?userId=${userId}&rootAuthName=测试`
    },
    {
      errorMessageMode: "modal"
    }
  );
};
