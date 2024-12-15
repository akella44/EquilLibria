import { FC, useEffect, useState } from "react";
import { ImageItem } from "../ImageItem";
import s from "./ImagesList.module.css";
import { useIntersection } from "@/shared/hooks/useIntersection";
import { getImageById } from "@/shared/api/FileService/fileControllerApi";
import { importModalStore } from "@/store/importModal";

interface ImageListProps {
  ids: number[];
}

export const ImagesList: FC<ImageListProps> = ({ ids }) => {
  const [rects, setRects] = useState([]);
  const [page, setPage] = useState(0);
  const [imgs, setImgs] = useState([]);

  const fetchNextImgs = async () => {
    const promises = [];
    const startIndex = Math.min(page * 10, ids.length);
    const endIndex = Math.min(startIndex + 10, ids.length);

    for (let i = startIndex; i < endIndex; i++) {
      promises.push(getImageById(ids[i]));
    }

    try {
      const imagesData = await Promise.all(promises);
      setImgs((prevImgs) => [
        ...prevImgs,
        ...imagesData.map((data) => data.data),
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchImageWithRetry = async (id, delay = 3000) => {
    while (true && importModalStore.getIsRequest()) {
      const image = await getImageById(id);
      console.log(image);
      if (image.data && image.data.rects && image.data.rects.length > 0) {
        setRects((prevRects) => [
          ...prevRects,
          { id: image.data.id, rects: [...image.data.rects] },
        ]);
        return image.data;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  };

  const fetchNextPage = async () => {
    if (page * 10 >= ids.length) return;

    const promises = [];
    const startIndex = Math.min(page * 10, ids.length);
    const endIndex = Math.min(startIndex + 10, ids.length);

    for (let i = startIndex; i < endIndex; i++) {
      promises.push(fetchImageWithRetry(ids[i]));
    }

    if (promises.length > 0) {
      for (const promise of promises) {
        try {
          const data = await promise;
          if (data.rects) {
            setRects((prevRects) => [
              ...prevRects,
              { id: data.id, rects: [...data.rects] },
            ]);
          } else {
            setRects((prevRects) => [...prevRects, {}]);
          }
        } catch (error) {
          console.error("Ошибка при загрузке изображения:", error);
          setRects((prevRects) => [...prevRects, {}]);
        }
      }
    }
  };

  useEffect(() => {
    fetchNextPage();
  }, [page]);

  const handleIntersect = async () => {
    try {
      await fetchNextImgs();
    } catch (error) {
      console.error("Ошибка при загрузке:", error);
    } finally {
      setPage((prev) => prev + 1);
    }
  };

  const cursor = useIntersection(() => {
    handleIntersect();
  });

  const type = importModalStore.getType();

  return (
    <div className={s.imagesList}>
      {imgs.length > 0 &&
        imgs.map((image, index) => (
          <div
            className={s.item}
            key={index}
            style={
              type === "img"
                ? { position: "absolute", top: 0, left: 0, minWidth: "100%" }
                : undefined
            }
          >
            <ImageItem
              img={image.url}
              rect={rects.find((rect) => rect.id === image.id)?.rects}
            />
          </div>
        ))}
      {page * 10 < ids.length && <div className={s.cursor} ref={cursor}></div>}
    </div>
  );
};
