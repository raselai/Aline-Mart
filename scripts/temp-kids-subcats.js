require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

(async () => {
  const { data: kids, error: kidsErr } = await supabase
    .from("Category")
    .select("id,slug")
    .eq("slug", "kids")
    .single();

  if (kidsErr || !kids) {
    console.error("Kids category not found");
    process.exit(1);
  }

  const subcats = [
    { id: "cat_kids-clothing", name: "Kids' Clothing", slug: "kids-clothing", parentId: kids.id },
    { id: "cat_kids-shoes", name: "Kids' Shoes", slug: "kids-shoes", parentId: kids.id },
    { id: "cat_kids-accessories", name: "Kids' Accessories", slug: "kids-accessories", parentId: kids.id },
  ];

  for (const subcat of subcats) {
    const { data: existing } = await supabase
      .from("Category")
      .select("id")
      .eq("slug", subcat.slug)
      .maybeSingle();

    if (existing) {
      console.log("- Already exists: " + subcat.name);
      continue;
    }

    const { error } = await supabase
      .from("Category")
      .insert({
        id: subcat.id,
        name: subcat.name,
        slug: subcat.slug,
        parentId: subcat.parentId,
      });

    if (error) {
      console.error("Error creating " + subcat.name + ":", error);
    } else {
      console.log("Created: " + subcat.name);
    }
  }
})();
