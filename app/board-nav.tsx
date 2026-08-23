"use client";

import Link from "next/link";
import {  Box, Group, NavLink, Stack, Text } from "@mantine/core";
import { listBoardNavItems } from "@/boards";
import { useState } from "react";
import {
  IconMap2,
  IconRoute,
  IconMapPin,
  IconNotebook,
  IconUsers,
  IconSettings,
} from '@tabler/icons-react';


interface NavItem {
  label: string;
  bearing: number;
  icon: typeof IconMap2;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboards', bearing: 0, icon: IconMap2 },
 
];

const CONSTRUCTION_NAV_ITEMS: NavItem[] = [
   { label: 'Trails', bearing: 60, icon: IconRoute },
  { label: 'Waypoints', bearing: 120, icon: IconMapPin },
  { label: 'Journal', bearing: 180, icon: IconNotebook },
  { label: 'Crew', bearing: 240, icon: IconUsers },
  { label: 'Settings', bearing: 300, icon: IconSettings },
];

function bearingLabel(bearing: number) {
  return `${String(bearing).padStart(3, '0')}\u00B0`;
}



export function BoardNav() {

   const [activeIndex] = useState(0);
    const activeBearing = NAV_ITEMS[activeIndex].bearing;
  

  const boards = listBoardNavItems();


    return (
    <Box
      style={{
        width: 260,
        height: '100%',
        minHeight: 580,       
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      component='nav'
      aria-label="Boards"
    >
      {/* Brand + heading indicator */}
      <Group gap={12} px={20} py={18} wrap="nowrap" style={{ borderBottom: '0.5px solid rgba(92,67,38,0.3)' }}>
        <Box
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            border: `1px solid brown`,
            position: 'relative',
            flexShrink: 0,
          }}
        >
          <Box
            style={{
              position: 'absolute',
              top: 3,
              left: '50%',
              width: 2,
              height: 12,
              background: 'var(--mantine-color-accent-9)',
              transformOrigin: '50% 14px',
              transform: `rotate(${activeBearing}deg)`,
              transition: 'transform 0.4s ease',
            }}
          />
          <Box
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 3,
              height: 3,
              background: 'var(--mantine-color-earthBrown-9)',
              borderRadius: '50%',
              transform: 'translate(-50%,-50%)',
            }}
          />
        </Box>
        <div>
          <Text size="sm" fw={500} c={'earthBrown.9'} style={{ letterSpacing: 0.3 }}>
            compass boards
          </Text>
          <Text size="xs" c={'earthBrown.9'} ff="monospace">
            field ops
          </Text>
        </div>
      </Group>

    
      {/* Nav items */}
      <Stack gap={2} py={14} style={{ flex: 1 }}>
        {NAV_ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              label={item.label}
              active={isActive}
              onClick={() => {}}
              leftSection={
                <Group gap={12} wrap="nowrap">
                  <Text
                    ff="monospace"
                    size="10px"
                    c={isActive ? 'var(--mantine-color-accent-9)' : 'var(--mantine-color-earthBrown-5)'}
                    style={{ width: 30, flexShrink: 0 }}
                  >
                    {bearingLabel(item.bearing)}
                  </Text>
                  <Icon size={17} color={isActive ? 'var(--mantine-color-earthBrown-9)' : 'var(--mantine-color-earthBrown-7)'} />
                </Group>
              }
              styles={{
                root: {
                  borderLeft: `2px solid ${isActive ? 'var(--mantine-color-accent-9)' : 'transparent'}`,
                  borderRadius: 0,
                  backgroundColor: isActive ? 'rgba(140,58,42,0.1)' : 'transparent',
                  padding: '11px 20px',
                },
                label: {
                  fontSize: 13.5,
                  color: isActive ? 'var(--mantine-color-earthBrown-9)' : 'var(--mantine-color-earthBrown-7)',
                },
              }}
            />
          );
        })}
        {boards.map((board) => (
          <NavLink
            key={board.id}
            component={Link}
            leftSection={
              <IconMapPin size={17} color={'var(--mantine-color-earthBrown-9)'} />
            }
            href={`/boards/${board.id}`}
            label={board.label}
            styles={{
              root: {
                borderLeft: `60px solid transparent`,
                borderRadius: 0,
                backgroundColor: 'transparent',
                padding: '11px 20px',
              },
              label: {
                fontSize: 13.5,
                color: 'var(--mantine-color-earthBrown-9)',
              },
            }}
          />
        ))}     
          {CONSTRUCTION_NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              label={item.label}
              onClick={() => {}}
             
              leftSection={
                <Group gap={12} wrap="nowrap">
                  <Text
                    ff="monospace"
                    size="10px"
                    c={'grey'}
                    style={{ width: 30, flexShrink: 0 }}
                  >
                    {bearingLabel(item.bearing)}
                  </Text>
                  <Icon size={17} color={'grey'} />
                </Group>
              }
              styles={{
                root: {
                  borderLeft: `2px solid transparent`,
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  padding: '11px 20px',
                },
                label: {
                  fontSize: 13.5,
                  color: 'grey',
                },
              }}
            />
          );
        })}
      </Stack>

      
     
    </Box>
  );
}
