import React from 'react'
import { Button } from './ui/button'
import { Download, Plus } from 'lucide-react'

function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-12 bg-black/50 backdrop-blur-sm flex items-center px-4 border-b border-gray-800">
      <div className="flex-1 flex items-center gap-2">
        <h1 className="text-lg text-gray-100 font-mono">down.bad</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button color="white" size="icon" className="w-8 h-8">
          <Plus className="h-4 w-4" />
        </Button>
        <Button color="white" size="icon" className="w-8 h-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default TopBar