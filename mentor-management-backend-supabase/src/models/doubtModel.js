import supabase from "../config/supabase.js";

class Doubt {
  static async createDoubt(doubtData) {
    const { data, error } = await supabase
      .from("student_doubts")
      .insert({
        description: doubtData.description,
        section_id: doubtData.section_id,
        subject_id: doubtData.subject_id,
        resolution_status: doubtData.resolution_status,
        mentor_id: doubtData.mentor_id,
        date: doubtData.date,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating doubt:", error);
      throw error;
    }

    return data;
  }

  static async deleteDoubt(doubtId, mentorId) {
    const { data, error } = await supabase
      .from("student_doubts")
      .delete()
      .eq("doubt_id", doubtId)
      .eq("mentor_id", mentorId)
      .select()
      .single();

    if (error) {
      console.error("Error deleting doubt:", error);
      throw error;
    }

    return data;
  }

  static async getDoubtsByMentor(mentorId) {
    // First, get the doubts with section and subject names using multiple queries
    const { data: doubts, error: doubtsError } = await supabase
      .from("student_doubts")
      .select("*")
      .eq("mentor_id", mentorId)
      .order("date", { ascending: false });

    if (doubtsError) {
      console.error("Error fetching doubts:", doubtsError);
      throw doubtsError;
    }

    // Get all section and subject options in parallel
    const [sections, subjects] = await Promise.all([
      supabase.from("section_options").select("section_id, section_name"),
      supabase.from("subject_options").select("subject_id, subject_name"),
    ]);

    if (sections.error || subjects.error) {
      console.error("Error fetching options:", {
        sections: sections.error,
        subjects: subjects.error,
      });
      throw new Error("Failed to fetch section or subject options");
    }

    // Create lookup maps for sections and subjects
    const sectionMap = new Map(
      sections.data.map((s) => [s.section_id, s.section_name])
    );
    const subjectMap = new Map(
      subjects.data.map((s) => [s.subject_id, s.subject_name])
    );

    // Map the doubts with section and subject names
    return doubts.map((doubt) => ({
      ...doubt,
      section_name: sectionMap.get(doubt.section_id) || "Unknown Section",
      subject_name: subjectMap.get(doubt.subject_id) || "Unknown Subject",
    }));
  }
}

export default Doubt;
