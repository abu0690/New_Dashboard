import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { 
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';

import { 
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import {
  LayoutDashboard,
  Users,
  Database,
  FileText,
  LogOut,
  GripVertical,
  X
} from 'lucide-react';

import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import telesatLogo from '../../assets/images/telesat.png';

/* ICON MAP */
const iconMap = {
  LayoutDashboard,
  Users,
  Database,
  FileText
};

/* DEFAULT MENU ITEMS */
const initialMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
  { id: 'customers', label: 'Customer Management', icon: 'Users', path: '/customers' },
  { id: 'pool', label: 'Pool Management', icon: 'Database', path: '/pool' },
  { id: 'plan', label: 'Plan Management', icon: 'FileText', path: '/plan' }
];

/* SORTABLE COMPONENT */
function SortableMenuItem({ item, isActive, onClick, customColor }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const Icon = iconMap[item.icon];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: customColor || (isActive ? '#2563eb' : 'transparent')
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
        !customColor && !isActive ? 'text-gray-300 hover:bg-white/10' : ''
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <GripVertical size={16} className="text-gray-400" />
      </div>
      <Icon size={20} />
      <span className="text-sm font-medium flex-1 cursor-pointer" onClick={onClick}>
        {item.label}
      </span>
    </div>
  );
}

/* MAIN SIDEBAR COMPONENT */
export default function Sidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { logo, primaryColor, tabColors } = useTheme();

  const [menuItems, setMenuItems] = useState(() => {
    const saved = localStorage.getItem('menuItems');
    return saved ? JSON.parse(saved) : initialMenuItems;
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* BACKDROP FOR MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* MOBILE SIDEBAR (SLIDE-IN) */}
      <div
        className={`fixed inset-y-0 left-0 w-64 text-white flex flex-col z-50 transform lg:hidden transition-transform duration-300 ${
         isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: primaryColor }}

      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="relative w-full h-12 flex items-center justify-center">
            <img
              src={logo || telesatLogo}
              alt="Company Logo"
              className="h-full w-auto object-contain"
            />
          </div>

          <button onClick={closeSidebar} className="p-2 rounded-lg hover:bg-white/20">
            <X size={20} />
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={menuItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const customColor = tabColors[item.id];
                return (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    customColor={customColor}
                    onClick={() => {
                      closeSidebar();
                      navigate(item.path);
                    }}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* DESKTOP SIDEBAR */}
      <div
        className="hidden lg:flex w-64 text-white flex-col border-r border-white/20"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="p-6 border-b border-white/10">
          <div className="relative w-full h-12 flex items-center justify-center">
            <img
              src={logo || telesatLogo}
              alt="Company Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={menuItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const customColor = tabColors[item.id];
                return (
                  <SortableMenuItem
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    customColor={customColor}
                    onClick={() => navigate(item.path)}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600 transition-colors w-full"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
