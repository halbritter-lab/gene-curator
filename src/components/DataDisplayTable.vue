<!-- DataDisplayTable.vue -->
<template>
  <v-data-table :headers="headers" :items="items">
    <template v-slot:[`item.actions`]="{ item }">
      <v-btn @click="openModal(item)">Edit</v-btn>
    </template>
  </v-data-table>
    <CurationModal
    v-if="showModal"
    :item="selectedItem"
    :open="showModal"
    @save="saveData"
    @close="closeModal"
  />
</template>

<script>
import { ref } from 'vue';
import CurationModal from './CurationModal.vue';

export default {
  components: {
    CurationModal,
  },
  setup() {
    const items = ref([
      {
          "approved_symbol": "ACE",
          "hgnc_id": 2707,
          "evidence_count": 5,
          "source_count_percentile": 4.257174056734751,
          "pLI": 0,
          "oe_lof": 0.8746,
          "lof_z": 0.97837,
          "mis_z": -0.69323,
          "omim_summary": "{Stroke, hemorrhagic}[OMIM:614519]-NA | Renal tubular dysgenesis[OMIM:267430]-Autosomal recessive inheritance | {Microvascular complications of diabetes 3}[OMIM:612624]-NA",
          "gencc_summary": "Limited, Supportive (renal tubular dysgenesis of genetic origin[MONDO:0009970]-Autosomal recessive) | Limited (intracerebral hemorrhage[MONDO:0013792]-Unknown) | Strong (renal tubular dysgenesis[MONDO:0017609]-Autosomal recessive)",
          "clingen_summary": "NULL",
          "clinvar": "P:24; LP:15; VUS:221",
          "clinical_groups_p": "OMIM:267430 (complement: 0.143 | cakut: 0.016 | glomerulopathy: 0.007 | cyst_cilio: 0.003)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:267430 (syndromic: 0.014 | skeletal: 0.05 | neurologic: 0.029)",
          "mgi_phenotype": "hm (true); ht (true)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 3097,
          "stringdb_interaction_normalized_score": 0.5723270440251572,
          "stringdb_interaction_string": "9606.ENSP00000252486:325, 9606.ENSP00000305302:442, 9606.ENSP00000215832:379, 9606.ENSP00000355627:700, 9606.ENSP00000368727:311, 9606.ENSP00000231509:216, 9606.ENSP00000216181:508, 9606.ENSP00000325822:216",
          "expression_score": 0,
          "gtex_kidney_medulla": 2.02982,
          "gtex_kidney_cortex": 3.8524,
          "descartes_kidney_tpm": 2.0540630055529,
          "cur_id": "cur_001"
        },
        {
          "approved_symbol": "ACTG2",
          "hgnc_id": 145,
          "evidence_count": 4,
          "source_count_percentile": 3.007962351574665,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "Megacystis-microcolon-intestinal hypoperistalsis syndrome 5[OMIM:619431]-Autosomal dominant inheritance | Visceral myopathy 1[OMIM:155310]-Autosomal dominant inheritance",
          "gencc_summary": "Supportive (megacystis-microcolon-intestinal hypoperistalsis syndrome[MONDO:0007960]-Autosomal dominant) | Supportive (familial visceral myopathy[MONDO:0016829]-Autosomal dominant) | Strong (visceral myopathy 1[MONDO:0020754]-Autosomal dominant)",
          "clingen_summary": "NULL",
          "clinvar": "P:22; LP:17; VUS:28",
          "clinical_groups_p": "OMIM:155310 (cakut: 0.137 | cyst_cilio: 0.021 | cancer: 0.02 | nephrocalcinosis: 0.007 | glomerulopathy: 0.002); OMIM:619431 (cakut: 0.097 | cancer: 0.02 | cyst_cilio: 0.018 | nephrocalcinosis: 0.007 | glomerulopathy: 0.002)",
          "onset_groups_p": "OMIM:619431 (antenatal_or_congenital: 0.899)",
          "syndromic_groups_p": "OMIM:155310 (syndromic: 0.005 | neurologic: 0.011)",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 2582,
          "stringdb_interaction_normalized_score": 0.5073375262054507,
          "stringdb_interaction_string": "9606.ENSP00000262518:194, 9606.ENSP00000357283:209, 9606.ENSP00000311505:153, 9606.ENSP00000252699:206, 9606.ENSP00000216181:910, 9606.ENSP00000379616:910",
          "expression_score": 0,
          "gtex_kidney_medulla": 2.30606,
          "gtex_kidney_cortex": 0.9816030000000001,
          "descartes_kidney_tpm": 0.838759965043748,
          "cur_id": "cur_002"
        },
        {
          "approved_symbol": "ACTN4",
          "hgnc_id": 166,
          "evidence_count": 5,
          "source_count_percentile": 4.057388332144462,
          "pLI": 1,
          "oe_lof": 0.02077,
          "lof_z": 6.2964,
          "mis_z": 4.1552,
          "omim_summary": "Glomerulosclerosis, focal segmental, 1[OMIM:603278]-Autosomal dominant inheritance",
          "gencc_summary": "Moderate (focal segmental glomerulosclerosis 1[MONDO:0011303]-Autosomal dominant) | Strong, Supportive (familial idiopathic steroid-resistant nephrotic syndrome[MONDO:0019006]-Autosomal dominant)",
          "clingen_summary": "NULL",
          "clinvar": "P:5; LP:5; VUS:89",
          "clinical_groups_p": "OMIM:603278 (glomerulopathy: 0.235 | cyst_cilio: 0.165 | cakut: 0.069 | cancer: 0.05 | tubulopathy: 0.049 | nephrocalcinosis: 0.042 | complement: 0.036)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "NULL",
          "mgi_phenotype": "hm (true); ht (false)",
          "interaction_score": 1,
          "stringdb_interaction_sum_score": 11037,
          "stringdb_interaction_normalized_score": 0.9308176100628931,
          "stringdb_interaction_string": "9606.ENSP00000269305:163, 9606.ENSP00000231509:309, 9606.ENSP00000265970:190, 9606.ENSP00000358866:187, 9606.ENSP00000288235:321, 9606.ENSP00000386896:650, 9606.ENSP00000352264:437, 9606.ENSP00000386857:206, 9606.ENSP00000362924:292, 9606.ENSP00000356587:739, 9606.ENSP00000482968:380, 9606.ENSP00000356319:292, 9606.ENSP00000376410:336, 9606.ENSP00000379204:206, 9606.ENSP00000367316:650, 9606.ENSP00000265748:473, 9606.ENSP00000216181:447, 9606.ENSP00000362424:292, 9606.ENSP00000200181:650, 9606.ENSP00000340913:454, 9606.ENSP00000377789:728, 9606.ENSP00000287820:292, 9606.ENSP00000356405:292, 9606.ENSP00000368190:914, 9606.ENSP00000346839:346, 9606.ENSP00000228606:292, 9606.ENSP00000352138:499",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 157.86700000000002,
          "gtex_kidney_cortex": 140.608,
          "descartes_kidney_tpm": 426.248179504114,
          "cur_id": "cur_003"
        },
        {
          "approved_symbol": "ADAMTS13",
          "hgnc_id": 1366,
          "evidence_count": 5,
          "source_count_percentile": 3.273615423619376,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "Thrombotic thrombocytopenic purpura, hereditary[OMIM:274150]-Autosomal recessive inheritance",
          "gencc_summary": "Definitive, Strong, Strong, Supportive (congenital thrombotic thrombocytopenic purpura[MONDO:0010122]-Autosomal recessive)",
          "clingen_summary": "Definitive (congenital thrombotic thrombocytopenic purpura[MONDO:0010122]-AR)",
          "clinvar": "P:41; LP:22; VUS:227",
          "clinical_groups_p": "OMIM:274150 (complement: 0.143 | glomerulopathy: 0.042 | tubulopathy: 0.028 | nephrocalcinosis: 0.021)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:274150 (syndromic: 0.005 | neurologic: 0.01)",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 793,
          "stringdb_interaction_normalized_score": 0.1928721174004193,
          "stringdb_interaction_string": "9606.ENSP00000386896:244, 9606.ENSP00000367316:225, 9606.ENSP00000437256:161, 9606.ENSP00000280481:163",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 4.84555,
          "gtex_kidney_cortex": 3.2947699999999998,
          "descartes_kidney_tpm": 13.3578951909432,
          "cur_id": "cur_004"
        },
        {
          "approved_symbol": "ADAMTS9",
          "hgnc_id": 13202,
          "evidence_count": 2,
          "source_count_percentile": 1.797236241211451,
          "pLI": 0.000001,
          "oe_lof": 0.29427,
          "lof_z": 7.1321,
          "mis_z": 0.95461,
          "omim_summary": "NULL",
          "gencc_summary": "Limited (ciliopathy[MONDO:0005308]-Autosomal recessive) | Supportive (nephronophthisis 1[MONDO:0009728]-Autosomal recessive)",
          "clingen_summary": "Limited (ciliopathy[MONDO:0005308]-AR)",
          "clinvar": "P:0; LP:1; VUS:120",
          "clinical_groups_p": "NULL",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "NULL",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0,
          "stringdb_interaction_sum_score": 171,
          "stringdb_interaction_normalized_score": 0.031446540880503145,
          "stringdb_interaction_string": "9606.ENSP00000256646:171",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 11.9264,
          "gtex_kidney_cortex": 10.9867,
          "descartes_kidney_tpm": 204.377287163022,
          "cur_id": "cur_005"
        },
        {
          "approved_symbol": "ADCY10",
          "hgnc_id": 21285,
          "evidence_count": 4,
          "source_count_percentile": 2.0714247394040384,
          "pLI": 0,
          "oe_lof": 0.84637,
          "lof_z": 1.2854,
          "mis_z": 0.45524,
          "omim_summary": "{Hypercalciuria, absorptive, susceptibility to}[OMIM:143870]-Autosomal dominant inheritance",
          "gencc_summary": "Strong, Limited (hypercalciuria, absorptive, 2[MONDO:0007748]-Autosomal dominant) | Supportive (idiopathic inherited hypercalciuria[MONDO:0016352]-Autosomal dominant)",
          "clingen_summary": "NULL",
          "clinvar": "P:15; LP:3; VUS:139",
          "clinical_groups_p": "OMIM:143870 (tubulopathy: 0.028 | nephrocalcinosis: 0.021)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "NULL",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0,
          "stringdb_interaction_sum_score": 300,
          "stringdb_interaction_normalized_score": 0.07127882599580712,
          "stringdb_interaction_string": "9606.ENSP00000078429:300",
          "expression_score": 0,
          "gtex_kidney_medulla": 0.028280700000000002,
          "gtex_kidney_cortex": 0.0295587,
          "descartes_kidney_tpm": 4.05616707548396,
          "cur_id": "cur_006"
        },
        {
          "approved_symbol": "AFF3",
          "hgnc_id": 6473,
          "evidence_count": 2,
          "source_count_percentile": 1.0390919821927485,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "KINSSHIP syndrome[OMIM:619297]-Autosomal dominant inheritance",
          "gencc_summary": "NULL",
          "clingen_summary": "NULL",
          "clinvar": "P:7; LP:4; VUS:56",
          "clinical_groups_p": "OMIM:619297 (cakut: 0.117 | cancer: 0.1 | cyst_cilio: 0.047 | glomerulopathy: 0.011 | tubulopathy: 0.007)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:619297 (syndromic: 0.163 | growth: 0.421 | skeletal: 0.174 | neurologic: 0.176)",
          "mgi_phenotype": "hm (false); ht (false)",
          "interaction_score": 0,
          "stringdb_interaction_sum_score": 540,
          "stringdb_interaction_normalized_score": 0.13626834381551362,
          "stringdb_interaction_string": "9606.ENSP00000356405:540",
          "expression_score": 1,
          "gtex_kidney_medulla": 0.765606,
          "gtex_kidney_cortex": 0.734201,
          "descartes_kidney_tpm": 1323.30740570324,
          "cur_id": "cur_007"
        },
        {
          "approved_symbol": "AGT",
          "hgnc_id": 333,
          "evidence_count": 5,
          "source_count_percentile": 4.152697193639472,
          "pLI": 0,
          "oe_lof": 0.89384,
          "lof_z": 0.36045,
          "mis_z": -0.19921,
          "omim_summary": "Renal tubular dysgenesis[OMIM:267430]-Autosomal recessive inheritance | {Hypertension, essential, susceptibility to}[OMIM:145500]-Multifactorial inheritance",
          "gencc_summary": "Supportive (renal tubular dysgenesis of genetic origin[MONDO:0009970]-Autosomal recessive) | Strong (renal tubular dysgenesis[MONDO:0017609]-Autosomal recessive)",
          "clingen_summary": "NULL",
          "clinvar": "P:6; LP:5; VUS:76",
          "clinical_groups_p": "OMIM:267430 (complement: 0.143 | cakut: 0.016 | glomerulopathy: 0.007 | cyst_cilio: 0.003)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:267430 (syndromic: 0.014 | skeletal: 0.05 | neurologic: 0.029)",
          "mgi_phenotype": "hm (true); ht (true)",
          "interaction_score": 0.5,
          "stringdb_interaction_sum_score": 4966,
          "stringdb_interaction_normalized_score": 0.740041928721174,
          "stringdb_interaction_string": "9606.ENSP00000272190:961, 9606.ENSP00000269305:229, 9606.ENSP00000350815:614, 9606.ENSP00000315011:693, 9606.ENSP00000290866:700, 9606.ENSP00000346839:292, 9606.ENSP00000347244:229, 9606.ENSP00000260649:910, 9606.ENSP00000339191:175, 9606.ENSP00000237014:163",
          "expression_score": 0,
          "gtex_kidney_medulla": 17.4583,
          "gtex_kidney_cortex": 28.7566,
          "descartes_kidney_tpm": 1.15796494559246,
          "cur_id": "cur_008"
        },
        {
          "approved_symbol": "AGTR1",
          "hgnc_id": 336,
          "evidence_count": 5,
          "source_count_percentile": 4.086652680860323,
          "pLI": "NULL",
          "oe_lof": "NULL",
          "lof_z": "NULL",
          "mis_z": "NULL",
          "omim_summary": "{Hypertension, essential}[OMIM:145500]-Multifactorial inheritance | Renal tubular dysgenesis[OMIM:267430]-Autosomal recessive inheritance",
          "gencc_summary": "No Known Disease Relationship (essential hypertension, genetic[MONDO:0007781]-Unknown) | Moderate, Supportive (renal tubular dysgenesis of genetic origin[MONDO:0009970]-Autosomal recessive)",
          "clingen_summary": "NULL",
          "clinvar": "P:5; LP:4; VUS:67",
          "clinical_groups_p": "OMIM:267430 (complement: 0.143 | cakut: 0.016 | glomerulopathy: 0.007 | cyst_cilio: 0.003)",
          "onset_groups_p": "NULL",
          "syndromic_groups_p": "OMIM:267430 (syndromic: 0.014 | skeletal: 0.05 | neurologic: 0.029)",
          "mgi_phenotype": "hm (true); ht (false)",
          "interaction_score": 0,
          "stringdb_interaction_sum_score": "NULL",
          "stringdb_interaction_normalized_score": "NULL",
          "stringdb_interaction_string": "NULL",
          "expression_score": 0.5,
          "gtex_kidney_medulla": 5.070209999999999,
          "gtex_kidney_cortex": 5.55385,
          "descartes_kidney_tpm": 36.7676972052136,
          "cur_id": "cur_009"
        },
      // Add more dummy rows if needed...
    ]);

    const headers = [
      { text: 'Approved Symbol', value: 'approved_symbol' },
      { text: 'HGNC ID', value: 'hgnc_id' },
      // Define headers for other fields...
      { text: 'Actions', value: 'actions', sortable: false },
    ];

    const showModal = ref(false);
    const selectedItem = ref(null);

    const openModal = (item) => {
      selectedItem.value = item;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const saveData = (updatedItem) => {
      console.log(updatedItem);
      // Handle the save operation here...
    };

    return {
      items,
      headers,
      showModal,
      selectedItem,
      openModal,
      closeModal,
      saveData,
    };
  },
};
</script>
