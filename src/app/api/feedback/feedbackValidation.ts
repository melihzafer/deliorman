import { z } from 'zod';

export const feedbackSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Моля, въведете съобщение')
    .min(10, 'Съобщението трябва да съдържа поне 10 символа')
    .max(1000, 'Съобщението не може да надвишава 1000 символа'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  category: z.enum(['service', 'food', 'vibes', 'other']).optional().nullable(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: 'Моля, приемете условията за ползване преди изпращане',
  }),
  // Honeypot: hidden in the UI, real users never fill it.
  website: z.string().optional().nullable(),
});

export type FeedbackPayload = z.infer<typeof feedbackSchema>;
export type FeedbackCategory = NonNullable<FeedbackPayload['category']>;

export type FeedbackError = {
  field?: string;
  message: string;
};

export interface FeedbackErrorResponse {
  success: false;
  errors: FeedbackError[];
}

export interface FeedbackSuccessResponse {
  success: true;
  message: string;
}

export type FeedbackRouteResponse = FeedbackSuccessResponse | FeedbackErrorResponse;
