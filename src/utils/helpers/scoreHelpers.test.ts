import { describe, it, expect } from 'vitest';
import { calculateInfluenceScore, getScoreClass, getScoreLabel } from './scoreHelpers';
import { createMockInfluencer } from '../../../tests/test-utils';

describe('scoreHelpers', () => {
  describe('calculateInfluenceScore', () => {
    it('should calculate score correctly for low subscribers', () => {
      const influencer = createMockInfluencer({
        subscribers: 10000,
        engagement: 5,
        quality: 3,
      });
      const score = calculateInfluenceScore(influencer);
      // 10000/10000 = 1 + 5*30 + 3*10 = 1 + 150 + 30 = 181
      expect(score).toBe(181);
    });

    it('should calculate score correctly for medium subscribers', () => {
      const influencer = createMockInfluencer({
        subscribers: 100000,
        engagement: 7,
        quality: 4,
      });
      const score = calculateInfluenceScore(influencer);
      // 100000/10000 = 10 + 7*30 + 4*10 = 10 + 210 + 40 = 260
      expect(score).toBe(260);
    });

    it('should calculate score correctly for high subscribers', () => {
      const influencer = createMockInfluencer({
        subscribers: 500000,
        engagement: 9,
        quality: 5,
      });
      const score = calculateInfluenceScore(influencer);
      // 500000/10000 = 50 (max 50) + 9*30 + 5*10 = 50 + 270 + 50 = 370
      expect(score).toBe(370);
    });

    it('should cap subscribers score at 50', () => {
      const influencer = createMockInfluencer({
        subscribers: 1000000,
        engagement: 5,
        quality: 3,
      });
      const score = calculateInfluenceScore(influencer);
      // 1000000/10000 = 100 -> capped at 50 + 5*30 + 3*10 = 50 + 150 + 30 = 230
      expect(score).toBe(230);
    });

    it('should handle zero subscribers', () => {
      const influencer = createMockInfluencer({
        subscribers: 0,
        engagement: 10,
        quality: 5,
      });
      const score = calculateInfluenceScore(influencer);
      // 0/10000 = 0 + 10*30 + 5*10 = 0 + 300 + 50 = 350
      expect(score).toBe(350);
    });

    it('should handle minimum values', () => {
      const influencer = createMockInfluencer({
        subscribers: 0,
        engagement: 1,
        quality: 1,
      });
      const score = calculateInfluenceScore(influencer);
      // 0 + 1*30 + 1*10 = 0 + 30 + 10 = 40
      expect(score).toBe(40);
    });

    it('should handle maximum values', () => {
      const influencer = createMockInfluencer({
        subscribers: 1000000,
        engagement: 10,
        quality: 5,
      });
      const score = calculateInfluenceScore(influencer);
      // 50 (capped) + 10*30 + 5*10 = 50 + 300 + 50 = 400
      expect(score).toBe(400);
    });

    it('should return integer values', () => {
      const influencer = createMockInfluencer({
        subscribers: 5000,
        engagement: 7,
        quality: 4,
      });
      const score = calculateInfluenceScore(influencer);
      expect(Number.isInteger(score)).toBe(true);
    });
  });

  describe('getScoreLabel', () => {
    it('should return "Faible" for scores below 30', () => {
      expect(getScoreLabel(0)).toBe('Faible');
      expect(getScoreLabel(15)).toBe('Faible');
      expect(getScoreLabel(29)).toBe('Faible');
    });

    it('should return "Moyen" for scores 30-69', () => {
      expect(getScoreLabel(30)).toBe('Moyen');
      expect(getScoreLabel(50)).toBe('Moyen');
      expect(getScoreLabel(69)).toBe('Moyen');
    });

    it('should return "Élevé" for scores 70 and above', () => {
      expect(getScoreLabel(70)).toBe('Élevé');
      expect(getScoreLabel(200)).toBe('Élevé');
      expect(getScoreLabel(400)).toBe('Élevé');
    });
  });

  describe('getScoreClass', () => {
    it('should return danger class for low scores', () => {
      const className = getScoreClass(20);
      expect(className).toContain('danger');
    });

    it('should return accent class for medium scores', () => {
      const className = getScoreClass(50);
      expect(className).toContain('accent');
    });

    it('should return success class for high scores', () => {
      const className = getScoreClass(100);
      expect(className).toContain('success');
    });

    it('should return valid Tailwind classes', () => {
      expect(getScoreClass(10)).toBe('bg-danger/20 text-danger border-danger');
      expect(getScoreClass(50)).toBe('bg-accent/20 text-accent border-accent');
      expect(getScoreClass(100)).toBe('bg-success/20 text-success border-success');
    });
  });
});
