import { nextStep, minQuestionsFor, questionNumber } from "../../../src/app/masa/wizard/nextStep";

describe("nextStep state machine", () => {
  it("starts at intro and goes to q_mood", () => {
    expect(nextStep("intro", {})).toBe("q_mood");
    expect(nextStep("q_mood", { mood: "comfort" })).toBe("q_anchor");
  });

  it("food path: anchor=food → protein → hunger → spinning", () => {
    let step = nextStep("intro", {});
    step = nextStep(step, { mood: "comfort" });
    step = nextStep(step, { ...{ mood: "comfort" }, anchor: "food" });
    expect(step).toBe("q_food_protein");
    step = nextStep(step, { mood: "comfort", anchor: "food", foodProtein: "meat" });
    expect(step).toBe("q_food_hunger");
    step = nextStep(step, { mood: "comfort", anchor: "food", foodProtein: "meat", hunger: "meal" });
    expect(step).toBe("spinning");
  });

  it("sweet-only skips hunger", () => {
    const step = nextStep("q_food_protein", { mood: "comfort", anchor: "food", foodProtein: "sweet-only" });
    expect(step).toBe("spinning");
  });

  it("drink path: anchor=drink → temp → alcohol → profile → spinning", () => {
    let step = nextStep("q_anchor", { mood: "comfort", anchor: "drink" });
    expect(step).toBe("q_drink_temp");
    step = nextStep(step, { mood: "comfort", anchor: "drink", drinkTemp: "hot" });
    expect(step).toBe("q_drink_alcohol");
    step = nextStep(step, { mood: "comfort", anchor: "drink", drinkTemp: "hot", alcohol: "alcoholic" });
    expect(step).toBe("q_drink_profile");
    step = nextStep(step, { mood: "comfort", anchor: "drink", drinkTemp: "hot", alcohol: "alcoholic", drinkProfile: "any" });
    expect(step).toBe("spinning");
  });

  it("minQuestionsFor food is 4", () => {
    expect(minQuestionsFor({ anchor: "food" })).toBe(4);
  });

  it("minQuestionsFor drink is 4", () => {
    expect(minQuestionsFor({ anchor: "drink" })).toBe(4);
  });

  it("minQuestionsFor both is 6", () => {
    expect(minQuestionsFor({ anchor: "both" })).toBe(6);
  });

  it("minQuestionsFor sweet-only is 3", () => {
    expect(minQuestionsFor({ anchor: "food", foodProtein: "sweet-only" })).toBe(3);
  });

  it("questionNumber returns current/total for current step", () => {
    const q = questionNumber("q_anchor", { mood: "comfort", anchor: "food" });
    expect(q.current).toBeGreaterThan(0);
    expect(q.total).toBeGreaterThan(q.current);
  });
});
