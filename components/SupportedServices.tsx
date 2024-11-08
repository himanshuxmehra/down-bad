import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Plus } from 'lucide-react'

function SupportedServices() {
  return (
<DropdownMenu>
<DropdownMenuTrigger className='text-white flex items-center justify-between'><Plus className="h-4 w-4 mr-2" /> supported services</DropdownMenuTrigger>
<DropdownMenuContent className='bg-gray-700 text-white'>
  <DropdownMenuItem>Youtube</DropdownMenuItem>
  <DropdownMenuItem>Instagram</DropdownMenuItem>
  <DropdownMenuItem>More Coming Soon...</DropdownMenuItem>
  {/* <DropdownMenuItem></DropdownMenuItem> */}
</DropdownMenuContent>
</DropdownMenu>
  )
}

export default SupportedServices