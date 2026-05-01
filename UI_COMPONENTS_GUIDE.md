# UI Components Guide - Music App

Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng các UI components trong dự án. Tất cả các components được import từ `@/components/ui/`.

---

## 📋 Mục Lục

1. [Basic Components](#basic-components)
2. [Form Components](#form-components)
3. [Data Display](#data-display)
4. [Navigation](#navigation)
5. [Dialogs & Overlays](#dialogs--overlays)
6. [Content & Layout](#content--layout)
7. [Utilities](#utilities)

---

## Basic Components

### Button

**Mục đích:** Nút bấm có nhiều kiểu và kích thước khác nhau.

**Import:**
```jsx
import { Button } from '@/components/ui/button'
```

**Props:**
- `variant`: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
- `size`: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'
- `asChild`: boolean (cho phép render thành component khác)

**Cách sử dụng:**
```jsx
// Nút mặc định
<Button>Click me</Button>

// Nút với variant khác
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link Button</Button>

// Nút với kích thước khác
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">⚙️</Button>

// Nút vô hiệu hóa
<Button disabled>Disabled</Button>

// Với icon từ lucide-react
import { Music } from 'lucide-react'
<Button>
  <Music className="mr-2" /> 
  Play Music
</Button>
```

---

### Input

**Mục đích:** Trường nhập liệu cho text, email, password, v.v.

**Import:**
```jsx
import { Input } from '@/components/ui/input'
```

**Props:**
- `type`: 'text' | 'email' | 'password' | 'number' | 'date' (mặc định: 'text')
- `placeholder`: string
- `disabled`: boolean
- `required`: boolean

**Cách sử dụng:**
```jsx
// Input cơ bản
<Input placeholder="Enter text..." />

// Input email
<Input type="email" placeholder="your@email.com" />

// Input password
<Input type="password" placeholder="Password..." />

// Input với disabled
<Input placeholder="Read only" disabled />

// Input với value và onChange
const [email, setEmail] = useState('')
<Input 
  type="email"
  placeholder="Enter email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Label

**Mục đích:** Nhãn cho các form inputs.

**Import:**
```jsx
import { Label } from '@/components/ui/label'
```

**Cách sử dụng:**
```jsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="your@email.com" />
```

---

### Card

**Mục đích:** Container cho nội dung có viền và background.

**Import:**
```jsx
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
```

**Cấp độ (Sub-components):**
- `CardHeader`: Header của card
- `CardTitle`: Tiêu đề
- `CardDescription`: Mô tả
- `CardContent`: Nội dung chính
- `CardFooter`: Footer

**Cách sử dụng:**
```jsx
<Card>
  <CardHeader>
    <CardTitle>My Music</CardTitle>
    <CardDescription>Manage your playlists</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your music content here...</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

---

### Badge

**Mục đích:** Hiển thị metadata nhỏ hoặc status.

**Import:**
```jsx
import { Badge } from '@/components/ui/badge'
```

**Props:**
- `variant`: 'default' | 'secondary' | 'destructive' | 'outline'

**Cách sử dụng:**
```jsx
<Badge>New</Badge>
<Badge variant="secondary">In Progress</Badge>
<Badge variant="destructive">Hot</Badge>
<Badge variant="outline">Outline</Badge>
```

---

### Checkbox

**Mục đích:** Ô kiểm tra để chọn/bỏ chọn tùy chọn.

**Import:**
```jsx
import { Checkbox } from '@/components/ui/checkbox'
```

**Props:**
- `checked`: boolean
- `disabled`: boolean
- `onCheckedChange`: callback

**Cách sử dụng:**
```jsx
const [checked, setChecked] = useState(false)

<Checkbox 
  checked={checked}
  onCheckedChange={setChecked}
/>

// Với label
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">I agree to terms</Label>
</div>
```

---

### Switch

**Mục đích:** Toggle (bật/tắt) cho boolean options.

**Import:**
```jsx
import { Switch } from '@/components/ui/switch'
```

**Props:**
- `checked`: boolean
- `disabled`: boolean
- `onCheckedChange`: callback

**Cách sử dụng:**
```jsx
const [darkMode, setDarkMode] = useState(false)

<div className="flex items-center gap-2">
  <Label htmlFor="dark-mode">Dark Mode</Label>
  <Switch 
    id="dark-mode"
    checked={darkMode}
    onCheckedChange={setDarkMode}
  />
</div>
```

---

### Avatar

**Mục đích:** Hiển thị ảnh đại diện người dùng.

**Import:**
```jsx
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
```

**Cách sử dụng:**
```jsx
<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

---

## Form Components

### Form (React Hook Form)

**Mục đích:** Quản lý forms phức tạp với validation.

**Import:**
```jsx
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
```

**Cách sử dụng:**
```jsx
function LoginForm() {
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(values) {
    console.log('Form values:', values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email" 
                  placeholder="your@email.com" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

---

### Textarea

**Mục đích:** Trường nhập liệu multi-line.

**Import:**
```jsx
import { Textarea } from '@/components/ui/textarea'
```

**Props:**
- `placeholder`: string
- `disabled`: boolean
- `rows`: number

**Cách sử dụng:**
```jsx
<Textarea 
  placeholder="Write your description..." 
  rows={4}
/>
```

---

### Select

**Mục đích:** Dropdown để chọn từ danh sách các tùy chọn.

**Import:**
```jsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
```

**Cách sử dụng:**
```jsx
<Select defaultValue="pop">
  <SelectTrigger>
    <SelectValue placeholder="Select genre..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="pop">Pop</SelectItem>
    <SelectItem value="rock">Rock</SelectItem>
    <SelectItem value="jazz">Jazz</SelectItem>
    <SelectItem value="hip-hop">Hip Hop</SelectItem>
  </SelectContent>
</Select>
```

---

### Radio Group

**Mục đích:** Chọn một tùy chọn từ danh sách.

**Import:**
```jsx
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
```

**Cách sử dụng:**
```jsx
<RadioGroup defaultValue="option1">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

---

## Data Display

### Table

**Mục đích:** Hiển thị dữ liệu dạng bảng.

**Import:**
```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
```

**Cách sử dụng:**
```jsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Song Name</TableHead>
      <TableHead>Artist</TableHead>
      <TableHead>Duration</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Blinding Lights</TableCell>
      <TableCell>The Weeknd</TableCell>
      <TableCell>3:20</TableCell>
    </TableRow>
    <TableRow>
      <TableCell>As It Was</TableCell>
      <TableCell>Harry Styles</TableCell>
      <TableCell>2:31</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

---

### Tabs

**Mục đích:** Chia nội dung thành các tabs có thể chuyển đổi.

**Import:**
```jsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
```

**Cách sử dụng:**
```jsx
<Tabs defaultValue="playlist">
  <TabsList>
    <TabsTrigger value="playlist">My Playlist</TabsTrigger>
    <TabsTrigger value="liked">Liked Songs</TabsTrigger>
    <TabsTrigger value="recent">Recent</TabsTrigger>
  </TabsList>
  
  <TabsContent value="playlist">
    <p>Your playlists...</p>
  </TabsContent>
  
  <TabsContent value="liked">
    <p>Your liked songs...</p>
  </TabsContent>
  
  <TabsContent value="recent">
    <p>Recently played...</p>
  </TabsContent>
</Tabs>
```

---

### Accordion

**Mục đích:** Mở rộng/thu gọn sections có sẵn.

**Import:**
```jsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
```

**Cách sử dụng:**
```jsx
<Accordion type="single" collapsible>
  <AccordionItem value="item1">
    <AccordionTrigger>Genre 1: Pop</AccordionTrigger>
    <AccordionContent>
      Pop music content...
    </AccordionContent>
  </AccordionItem>
  
  <AccordionItem value="item2">
    <AccordionTrigger>Genre 2: Rock</AccordionTrigger>
    <AccordionContent>
      Rock music content...
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

---

### Progress

**Mục đích:** Hiển thị tiến độ (loading, progress bar).

**Import:**
```jsx
import { Progress } from '@/components/ui/progress'
```

**Cách sử dụng:**
```jsx
const [progress, setProgress] = useState(45)

<Progress value={progress} />

// Upload progress
import { useEffect } from 'react'
useEffect(() => {
  const timer = setTimeout(() => setProgress(100), 3000)
  return () => clearTimeout(timer)
}, [])
```

---

### Slider

**Mục đích:** Chọn giá trị từ một dãy (volume, seek bar).

**Import:**
```jsx
import { Slider } from '@/components/ui/slider'
```

**Cách sử dụng:**
```jsx
const [volume, setVolume] = useState([50])

<Slider 
  value={volume} 
  onValueChange={setVolume}
  min={0}
  max={100}
  step={1}
/>

// Sử dụng với audio
<input 
  type="range" 
  min="0" 
  max="100" 
  value={volume[0]}
  onChange={(e) => setVolume([Number(e.target.value)])}
/>
```

---

### Empty

**Mục đích:** Hiển thị trạng thái trống.

**Import:**
```jsx
import { Empty } from '@/components/ui/empty'
```

**Cách sử dụng:**
```jsx
{songs.length === 0 ? (
  <Empty description="No songs found" />
) : (
  <SongsList songs={songs} />
)}
```

---

### Skeleton

**Mục đích:** Placeholder loading skeleton.

**Import:**
```jsx
import { Skeleton } from '@/components/ui/skeleton'
```

**Cách sử dụng:**
```jsx
{isLoading ? (
  <div className="space-y-2">
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
) : (
  <div>Your content...</div>
)}
```

---

## Navigation

### Tabs (Navigation Tabs)

Xem phần [Tabs](#tabs) ở Data Display.

---

### Breadcrumb

**Mục đích:** Hiển thị đường dẫn breadcrumb.

**Import:**
```jsx
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
```

**Cách sử dụng:**
```jsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/playlists">Playlists</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>Current Playlist</BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

### Pagination

**Mục đích:** Phân trang cho danh sách dài.

**Import:**
```jsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
```

**Cách sử dụng:**
```jsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

---

### Navigation Menu

**Mục đích:** Menu điều hướng phức tạp với submenus.

**Import:**
```jsx
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu'
```

**Cách sử dụng:**
```jsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Explore</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-[400px] gap-3 p-4">
          <li><NavigationMenuLink href="#">New Releases</NavigationMenuLink></li>
          <li><NavigationMenuLink href="#">Popular</NavigationMenuLink></li>
          <li><NavigationMenuLink href="#">Trending</NavigationMenuLink></li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

---

### Dropdown Menu

**Mục đích:** Menu dropdown cho actions.

**Import:**
```jsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
```

**Cách sử dụng:**
```jsx
<DropdownMenu>
  <DropdownMenuTrigger>⋮ More</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Share</DropdownMenuItem>
    <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
    <DropdownMenuItem>Download</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## Dialogs & Overlays

### Dialog

**Mục đích:** Modal dialog cho user interaction.

**Import:**
```jsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
```

**Cách sử dụng:**
```jsx
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    
    <p>Your content here...</p>
    
    <DialogFooter>
      <Button>Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Alert Dialog

**Mục đích:** Dialog cảnh báo quan trọng.

**Import:**
```jsx
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
```

**Cách sử dụng:**
```jsx
<AlertDialog>
  <AlertDialogTrigger>Delete Song</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete Song?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. Are you sure?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### Drawer

**Mục đích:** Side drawer/sidebar modal.

**Import:**
```jsx
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from '@/components/ui/drawer'
```

**Cách sử dụng:**
```jsx
<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Playlist</DrawerTitle>
      <DrawerDescription>Select songs</DrawerDescription>
    </DrawerHeader>
    
    <div className="p-4">
      {/* Your content */}
    </div>
    
    <DrawerFooter>
      <DrawerClose>Close</DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

---

### Popover

**Mục đích:** Floating content box (tooltip-like).

**Import:**
```jsx
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
```

**Cách sử dụng:**
```jsx
<Popover>
  <PopoverTrigger>ⓘ Info</PopoverTrigger>
  <PopoverContent>
    <p>This is helpful information about the song...</p>
  </PopoverContent>
</Popover>
```

---

### Tooltip

**Mục đích:** Hiện text khi hover (không interactive).

**Import:**
```jsx
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
```

**Cách sử dụng:**
```jsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent>This is a tooltip</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

---

### Alert

**Mục đích:** Thông báo/cảnh báo.

**Import:**
```jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
```

**Cách sử dụng:**
```jsx
<Alert>
  <AlertTitle>Success!</AlertTitle>
  <AlertDescription>Your song has been uploaded.</AlertDescription>
</Alert>

// Destructive variant
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>Something went wrong.</AlertDescription>
</Alert>
```

---

### Toast

**Mục đích:** Thông báo nhỏ tự động biến mất.

**Import:**
```jsx
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
```

**Cách sử dụng:**
```jsx
// Trong component
function MyComponent() {
  const { toast } = useToast()

  return (
    <>
      <Button onClick={() => 
        toast({
          title: "Success",
          description: "Song added to playlist!",
          duration: 2000,
        })
      }>
        Add to Playlist
      </Button>
    </>
  )
}

// Trong App.jsx root
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  )
}
```

---

### Context Menu

**Mục đích:** Right-click context menu.

**Import:**
```jsx
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/components/ui/context-menu'
```

**Cách sử dụng:**
```jsx
<ContextMenu>
  <ContextMenuTrigger>
    <div>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Add to Playlist</ContextMenuItem>
    <ContextMenuItem>Share</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Delete</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## Content & Layout

### Separator

**Mục đích:** Đường phân cách ngang/dọc.

**Import:**
```jsx
import { Separator } from '@/components/ui/separator'
```

**Cách sử dụng:**
```jsx
<div>
  <p>Content 1</p>
  <Separator />
  <p>Content 2</p>
</div>

// Vertical separator
<div className="flex">
  <div>Section 1</div>
  <Separator orientation="vertical" />
  <div>Section 2</div>
</div>
```

---

### Scroll Area

**Mục đích:** Scrollable container với custom scrollbar.

**Import:**
```jsx
import { ScrollArea } from '@/components/ui/scroll-area'
```

**Cách sử dụng:**
```jsx
<ScrollArea className="h-[300px] w-full">
  {songs.map(song => (
    <div key={song.id} className="p-4 border-b">
      {song.name}
    </div>
  ))}
</ScrollArea>
```

---

### Sheet

**Mục đích:** Full-screen or side sheet overlay.

**Import:**
```jsx
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet'
```

**Cách sử dụng:**
```jsx
<Sheet>
  <SheetTrigger>Open Settings</SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
    </SheetHeader>
    
    <div className="space-y-4 py-4">
      {/* Settings form */}
    </div>
    
    <SheetFooter>
      <SheetClose>Close</SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

### Sidebar

**Mục đích:** Sidebar navigation component.

**Import:**
```jsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  useSidebar,
} from '@/components/ui/sidebar'
```

**Cách sử dụng:**
```jsx
function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1>Music App</h1>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>Home</SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>Playlists</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter>
        <p>© 2024</p>
      </SidebarFooter>
    </Sidebar>
  )
}

// Trong App.jsx
<SidebarProvider>
  <AppSidebar />
  <main>Your content</main>
</SidebarProvider>
```

---

### Resizable

**Mục đích:** Resizable panels.

**Import:**
```jsx
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable'
```

**Cách sử dụng:**
```jsx
<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>
    <div>Left sidebar</div>
  </ResizablePanel>
  
  <ResizableHandle />
  
  <ResizablePanel defaultSize={50}>
    <div>Main content</div>
  </ResizablePanel>
</ResizablePanelGroup>
```

---

### Menubar

**Mục đích:** Menu bar (như File, Edit, View).

**Import:**
```jsx
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar'
```

**Cách sử dụng:**
```jsx
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>File</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Open</MenubarItem>
      <MenubarItem>Save</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>Exit</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
  
  <MenubarMenu>
    <MenubarTrigger>Edit</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>Copy</MenubarItem>
      <MenubarItem>Paste</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```

---

## Utilities

### Spinner

**Mục đích:** Loading spinner animation.

**Import:**
```jsx
import { Spinner } from '@/components/ui/spinner'
```

**Cách sử dụng:**
```jsx
{isLoading && <Spinner />}
```

---

### KBD (Keyboard)

**Mục đích:** Keyboard shortcut display.

**Import:**
```jsx
import { Kbd } from '@/components/ui/kbd'
```

**Cách sử dụng:**
```jsx
<p>Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to search</p>
```

---

### Carousel

**Mục đích:** Image/content carousel slider.

**Import:**
```jsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
```

**Cách sử dụng:**
```jsx
<Carousel>
  <CarouselContent>
    <CarouselItem>
      <img src="song1.jpg" alt="Song 1" />
    </CarouselItem>
    <CarouselItem>
      <img src="song2.jpg" alt="Song 2" />
    </CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>
```

---

### Calendar

**Mục đích:** Interactive calendar.

**Import:**
```jsx
import { Calendar } from '@/components/ui/calendar'
```

**Cách sử dụng:**
```jsx
const [date, setDate] = useState(new Date())

<Calendar 
  mode="single" 
  selected={date}
  onSelect={setDate}
/>
```

---

### Toggle

**Mục đích:** Button toggle (on/off).

**Import:**
```jsx
import { Toggle } from '@/components/ui/toggle'
```

**Cách sử dụng:**
```jsx
const [isActive, setIsActive] = useState(false)

<Toggle 
  pressed={isActive}
  onPressedChange={setIsActive}
>
  ♡ Like
</Toggle>
```

---

### Toggle Group

**Mục đích:** Nhóm toggle buttons.

**Import:**
```jsx
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
```

**Cách sử dụng:**
```jsx
<ToggleGroup type="single" defaultValue="list">
  <ToggleGroupItem value="list">List</ToggleGroupItem>
  <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
  <ToggleGroupItem value="table">Table</ToggleGroupItem>
</ToggleGroup>
```

---

### Hover Card

**Mục đích:** Card mở rộng khi hover.

**Import:**
```jsx
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from '@/components/ui/hover-card'
```

**Cách sử dụng:**
```jsx
<HoverCard>
  <HoverCardTrigger>@username</HoverCardTrigger>
  <HoverCardContent>
    <div className="space-y-2">
      <h4>@username</h4>
      <p>1.2M followers</p>
      <p>Verified artist</p>
    </div>
  </HoverCardContent>
</HoverCard>
```

---

### Sonner (Toast Notifications)

**Mục đích:** Advanced toast notifications library.

**Import:**
```jsx
import { Toaster, toast } from 'sonner'
```

**Cách sử dụng:**
```jsx
// Trigger toast
<Button onClick={() => toast.success('Song added!')}>
  Add
</Button>

// Trong App root
<Toaster />

// Các types
toast.success('Success!')
toast.error('Error!')
toast.loading('Loading...')
toast.custom((t) => <div>Custom toast {t}</div>)
```

---

### Input OTP

**Mục đích:** One-Time Password input.

**Import:**
```jsx
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
```

**Cách sử dụng:**
```jsx
const [otp, setOtp] = useState('')

<InputOTP value={otp} onChange={setOtp} maxLength={6}>
  <InputOTPGroup>
    <InputOTPSlot index={0} />
    <InputOTPSlot index={1} />
    <InputOTPSlot index={2} />
    <InputOTPSlot index={3} />
    <InputOTPSlot index={4} />
    <InputOTPSlot index={5} />
  </InputOTPGroup>
</InputOTP>
```

---

### Input Group

**Mục đích:** Input với prefix/suffix.

**Import:**
```jsx
import { InputGroup, InputGroupAddon, Input } from '@/components/ui/input-group'
```

**Cách sử dụng:**
```jsx
<InputGroup>
  <InputGroupAddon>$</InputGroupAddon>
  <Input placeholder="Price" type="number" />
</InputGroup>
```

---

### Button Group

**Mục đích:** Nhóm buttons liên quan.

**Import:**
```jsx
import { ButtonGroup } from '@/components/ui/button-group'
```

**Cách sử dụng:**
```jsx
<ButtonGroup>
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</ButtonGroup>
```

---

### Aspect Ratio

**Mục đích:** Container với fixed aspect ratio.

**Import:**
```jsx
import { AspectRatio } from '@/components/ui/aspect-ratio'
```

**Cách sử dụng:**
```jsx
<AspectRatio ratio={16 / 9}>
  <img src="album-art.jpg" alt="Album" className="object-cover" />
</AspectRatio>
```

---

### Hooks

#### useMobile

**Mục đích:** Check nếu đang dùng mobile device.

**Import:**
```jsx
import { useMobile } from '@/components/ui/use-mobile'
```

**Cách sử dụng:**
```jsx
function MyComponent() {
  const isMobile = useMobile()
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  )
}
```

---

#### useToast

Xem [Toast](#toast) ở trên.

---

### Chart

**Mục đích:** Components cho data visualization (charts, graphs).

**Import:**
```jsx
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartStyle,
} from '@/components/ui/chart'
```

---

## 📚 Tóm tắt

| Component | Mục đích | Kiểu |
|-----------|---------|------|
| Button | Click action | Basic |
| Input | Text input | Form |
| Label | Form label | Form |
| Card | Content container | Layout |
| Form | Manage forms | Form |
| Dialog | Modal popup | Dialog |
| Tabs | Tabbed content | Navigation |
| Table | Data display | Data |
| Toast | Notification | Feedback |
| Sidebar | Side navigation | Navigation |

---

## 🎯 Các Pattern Thường Dùng

### Login Form
```jsx
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const form = useForm({
    defaultValues: { email: '', password: '' }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl><Input type="email" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl><Input type="password" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />
        
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
```

### With Toaster
```jsx
import { Toaster } from '@/components/ui/toaster'

function App() {
  return (
    <>
      <YourRoutes />
      <Toaster />
    </>
  )
}
```

---

Hy vọng tài liệu này giúp bạn sử dụng các UI components một cách hiệu quả! 🎵
