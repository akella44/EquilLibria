import { uploadFiles } from "@/shared/api/FileService/fileControllerApi";
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  const { mutateAsync, isError, isSuccess, isPending } = useMutation({
    mutationFn: ({ file }: { file: File }) => uploadFiles(file),
    onSuccess: () => console.log("Файл отправлен"),
  });

  const uploadFile = async (file: File) => {
    const response = await mutateAsync({ file });
    return response.data;
  };

  return {
    uploadFile,
    isError,
    isSuccess,
    isPending,
  };
};
