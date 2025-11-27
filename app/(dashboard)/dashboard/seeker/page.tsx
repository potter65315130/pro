"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';

import theme from '@/theme/theme';
import HeroSection from '@/components/HeroSection';
import SearchSection from '@/components/SearchSection';
import JobListings from '@/components/cards/JobListings';
import PageContainer from "@/components/layout/PageContainer";

export default function SeekerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <PageContainer role="seeker">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box>
          <HeroSection />
          <SearchSection />
          <JobListings />
        </Box>
      </ThemeProvider>
    </PageContainer>
  );
}