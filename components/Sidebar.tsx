import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Download, Heart, Info, RefreshCw, Settings } from 'lucide-react';


function Sidebar() {
  return (
    <div className="fixed left-0 top-12 bottom-0 w-16 bg-black/50 backdrop-blur-sm border-r border-gray-800">
      <div className="flex flex-col items-center gap-4 py-4">
        <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button color="white" size="icon" className="w-10 h-10">
              <Download className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Save</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button color="white" size="icon" className="w-10 h-10">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Remux</TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-4 py-4">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button color="white" size="icon" className="w-10 h-10">
              <Settings className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button color="white" size="icon" className="w-10 h-10">
              <Heart className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Donate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button color="white" size="icon" className="w-10 h-10">
              <Info className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">About</TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default Sidebar