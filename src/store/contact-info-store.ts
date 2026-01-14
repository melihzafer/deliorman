import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContactInfo {
  name: string;
  phone: string;
  address: string;
}

interface ContactInfoStore {
  savedContact: ContactInfo | null;
  saveContact: (contact: ContactInfo) => void;
  clearContact: () => void;
  hasContact: () => boolean;
}

export const useContactInfoStore = create<ContactInfoStore>()(
  persist(
    (set, get) => ({
      savedContact: null,

      saveContact: (contact) => {
        set({ savedContact: contact });
      },

      clearContact: () => {
        set({ savedContact: null });
      },

      hasContact: () => {
        return get().savedContact !== null;
      },
    }),
    {
      name: 'contact-info-storage',
    }
  )
);
