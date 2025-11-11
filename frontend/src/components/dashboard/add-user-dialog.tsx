"use client"

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AddUserDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-600 rounded-xl h-10">
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl rounded-2xl p-0 overflow-hidden">
        <div className="border-b p-6">
          <DialogHeader>
            <DialogTitle className="text-xl">Add new user</DialogTitle>
          </DialogHeader>
        </div>

        <form
          className="p-6"
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="First Name" className="h-11 rounded-xl bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Last Name" className="h-11 rounded-xl bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Email" className="h-11 rounded-xl bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="Phone Number" className="h-11 rounded-xl bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" placeholder="Department" className="h-11 rounded-xl bg-muted/40" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Company" className="h-11 rounded-xl bg-muted/40" />
            </div>
          </div>

          <div className="border-t mt-6 pt-4 flex items-center justify-end">
            <DialogClose asChild>
              <Button type="submit" className="bg-blue-500 px-5 text-sm font-semibold text-white shadow-lg hover:bg-blue-600 rounded-xl h-10">
                Add User
              </Button>
            </DialogClose>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

