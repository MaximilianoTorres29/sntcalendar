import { ImageResponse } from "next/server";

export const size = {
  width: 512,
  height: 512
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #4f8f73 0%, #315f4b 100%)",
          color: "white",
          fontSize: 220,
          fontWeight: 700,
          fontFamily: "Arial, sans-serif"
        }}
      >
        A
      </div>
    ),
    size
  );
}
