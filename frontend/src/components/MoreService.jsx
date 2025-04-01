import videoOne from "../assets/vid1.mp4"

export default function MoreService() {
  return (
    <div
      className="w-full h-[75vh] px-28 py-10 flex justify-center items-center relative "
      id="insight"
    >
      <video
        src={videoOne}
        class="absolute top-0 left-0 w-full h-full object-cover flex items-center justify-center z-0"
        autoPlay
        muted
        loop
      ></video>
      <p className="text-6xl text-white font-semibold relative z-10">
        Secure & Seamless Payment Solutions
      </p>
    </div>
  )
}
