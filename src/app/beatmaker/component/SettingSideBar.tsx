import { useState } from "react";
import { GoArrowLeft } from "react-icons/go";
import { usePadStore } from "@/store/usePadStore";
import { useForm } from "react-hook-form";

type MenuItem = {
  key: string;
  label: string;
};

const MENU_LIST: MenuItem[] = [
  { key: "key", label: "패드 키 설정" },
  { key: "sound", label: "패드 소리 설정" },
  { key: "theme", label: "패드 테마 설정" },
];
type PadKeyFormData = {
  [padId: string]: string;
};

export default function SettingSideBar() {
  const { padGrid, updatePadKeys } = usePadStore();
  const [selectedMenu, setSelectedMenu] = useState<string>("none");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger,
  } = useForm<PadKeyFormData>({
    defaultValues: Object.fromEntries(padGrid.map((pad) => [pad.id, pad.key])),
  });

  const onSubmit = (data: PadKeyFormData) => {
    // 로컬스토리지에 저장
    localStorage.setItem("padKeys", JSON.stringify(data));
    // 패드 키 업데이트
    updatePadKeys(data);
    //PadGrid 업데이트 redux나 zustand로 관리할 예정
    alert("저장되었습니다!");
  };
  // 키 중복 검증
  const validateUniqueKey = (value: string, padId: string) => {
    const allValues = watch();
    const otherKeys = Object.entries(allValues)
      .filter(([id]) => id !== padId)
      .map(([, key]) => key);
    return !otherKeys.includes(value) || "이미 사용 중인 키입니다";
  };
  return (
    <div className="fixed right-0 top-0 h-full w-100 max-w-xs bg-white shadow-lg p-6 overflow-y-auto">
      {selectedMenu == "none" && (
        <ul>
          {MENU_LIST.map((menu) => (
            <li
              className="text-lg font-bold mb-4"
              key={menu.key}
              onClick={() => setSelectedMenu(menu.key)}
            >
              {menu.label}
            </li>
          ))}
        </ul>
      )}

      {/* 패드 키 설정 */}
      {selectedMenu === "key" && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <GoArrowLeft size={24} onClick={() => setSelectedMenu("none")} />
            <h2 className="text-lg font-bold mb-4">패드 키 설정</h2>
            {padGrid.map((pad) => (
              <div key={pad.id} className="flex flex-col">
                <label
                  htmlFor={`pad-key-${pad.id}`}
                  className="mb-1 font-medium"
                >
                  {pad.id}
                </label>
                <input
                  id={`pad-key-${pad.id}`}
                  className="border rounded px-2 py-1"
                  maxLength={1}
                  {...register(pad.id, {
                    required: "키를 입력해주세요",
                    pattern: {
                      value: /^[a-zA-Z0-9]$/,
                      message: "영문자 또는 숫자 1글자만 입력해주세요",
                    },
                    validate: (value) => validateUniqueKey(value, pad.id),
                  })}
                  onChange={async (e) => {
                    // register의 기본 onChange 먼저 실행
                    const fieldOnChange = register(pad.id).onChange;
                    fieldOnChange(e);

                    // 모든 필드 다시 검사
                    await Promise.all(padGrid.map((p) => trigger(p.id)));
                  }}
                />
                {errors[pad.id] && <span>{errors[pad.id]?.message}</span>}
              </div>
            ))}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      )}
      {/* 패드 소리 설정 */}
      {/* {selectedMenu === "sound" && (
        <div>
          <p>패드별 소리 설정 UI</p>
        </div>
      )} */}

      {/* 패드 테마 설정 */}
      {/* {selectedMenu === "theme" && (
        <div>
          <p>패드 테마 설정 UI</p>
        </div>
      )} */}
    </div>
  );
}
