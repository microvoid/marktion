'use client';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '@/components/ui/menubar';
import { Icon } from '@marktion/ui';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { DraftEditor } from './home-draft-editor';

export function Root() {
  return (
    <Drawer>
      <div className="h-screen">
        <DraftEditor />

        <div className="fixed left-0 right-0 bottom-10 w-[300px] m-auto">
          <SettingMenu />
        </div>
      </div>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export function SettingMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="mr-auto">
          <Icon name="Settings" />
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Toggle Preview <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>Copy As HTML</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Save File</MenubarItem>
          <MenubarItem>Save File As HTML</MenubarItem>
          <MenubarItem>Save File As Pdf</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <DrawerTrigger>
            <Icon name="User" />
          </DrawerTrigger>
        </MenubarTrigger>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>
          <Icon name="Globe" />
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
