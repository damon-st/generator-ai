"use client";

import { Button } from "@/components/ui/button";
import { Download, Pause, Play } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import WaveSurfer from "wavesurfer.js";

interface PlayerMusicProps {
  url: string;
  id: string;
}

export const PlayerMusic = ({ url, id }: PlayerMusicProps) => {
  const [wave, setWave] = useState<WaveSurfer>();
  const [isPlaygin, setIsPlaygin] = useState(false);
  useEffect(() => {
    const load = async () => {
      const waveIn = WaveSurfer.create({
        container: `#${id}`,
        waveColor: "#BBBBBB",
        progressColor: "rgb(219 39 119)",
        height: 70,
        cursorWidth: 1,
        cursorColor: "transparent",
        barWidth: 2,
        normalize: true,
        fillParent: true,
        url: url,
      });
      waveIn.on("finish", () => {
        setIsPlaygin(false);
      });
      setWave(waveIn);
    };

    load();
  }, [id, url]);

  const playAudio = async () => {
    try {
      if (wave?.isPlaying()) {
        wave?.pause();
        setIsPlaygin(false);
        return;
      }
      await wave?.play();
      setIsPlaygin(true);
    } catch (error) {
      console.log(error);
      toast.error("Error in play audio");
    }
  };

  return (
    <div className="w-full  ">
      <div id={id}></div>
      <div className="w-full flex items-center justify-center">
        <Button
          onClick={playAudio}
          size="icon"
          className="rounded-full p-2 flex items-center justify-center"
        >
          {isPlaygin ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8" />
          )}
        </Button>
      </div>
      <div className="w-full flex items-center justify-end">
        <Link
          href={url}
          download
          target="_blank"
          className="flex items-center justify-center gap-2 bg-primary/80 rounded-lg p-2 text-white"
        >
          Download <Download />
        </Link>
      </div>
    </div>
  );
};
